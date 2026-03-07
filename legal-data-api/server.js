const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');

// Load data files
const statuteData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'statute-of-limitations.json'), 'utf8'));
const settlementData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'settlements.json'), 'utf8'));
const insuranceData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'insurance-coverage.json'), 'utf8'));

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests, please try again later.',
    retryAfter: '15 minutes'
  }
});
app.use(limiter);

// RapidAPI headers middleware
app.use((req, res, next) => {
  res.setHeader('X-RapidAPI-Proxy-Response', 'true');
  next();
});

// Case types definition
const CASE_TYPES = [
  { id: 'personal-injury', name: 'Personal Injury', description: 'Physical injuries to a person' },
  { id: 'property-damage', name: 'Property Damage', description: 'Damage to personal or real property' },
  { id: 'wrongful-death', name: 'Wrongful Death', description: 'Death caused by negligence or misconduct' },
  { id: 'medical-malpractice', name: 'Medical Malpractice', description: 'Negligence by healthcare professionals' }
];

// Injury types definition
const INJURY_TYPES = [
  { id: 'slip-and-fall', name: 'Slip and Fall' },
  { id: 'car-accident', name: 'Car Accident' },
  { id: 'medical-malpractice', name: 'Medical Malpractice' },
  { id: 'workplace-injury', name: 'Workplace Injury' }
];

/**
 * @api {get} / Health Check
 * @apiDescription API health check and status
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Legal Data API',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      statuteOfLimitations: '/statute-of-limitations/:state/:caseType',
      averageSettlement: '/average-settlement/:injuryType',
      insuranceCoverage: '/insurance-coverage/:state',
      states: '/states',
      caseTypes: '/case-types'
    },
    documentation: 'https://rapidapi.com/your-api-provider/legal-data-api'
  });
});

/**
 * @api {get} /states Get All States
 * @apiDescription Returns list of all US states with their codes
 */
app.get('/states', (req, res) => {
  const states = Object.keys(statuteData).map(code => ({
    code: code,
    name: statuteData[code].name
  }));

  res.json({
    count: states.length,
    states: states
  });
});

/**
 * @api {get} /case-types Get All Case Types
 * @apiDescription Returns list of available case types
 */
app.get('/case-types', (req, res) => {
  res.json({
    count: CASE_TYPES.length,
    caseTypes: CASE_TYPES
  });
});

/**
 * @api {get} /injury-types Get All Injury Types
 * @apiDescription Returns list of available injury types for settlement data
 */
app.get('/injury-types', (req, res) => {
  res.json({
    count: INJURY_TYPES.length,
    injuryTypes: INJURY_TYPES
  });
});

/**
 * @api {get} /statute-of-limitations/:state/:caseType Get Statute of Limitations
 * @apiDescription Returns statute of limitations in years for a specific state and case type
 * @apiParam {String} state State code (e.g., CA, NY, TX)
 * @apiParam {String} caseType Case type (personal-injury, property-damage, wrongful-death, medical-malpractice)
 */
app.get('/statute-of-limitations/:state/:caseType', (req, res) => {
  const { state, caseType } = req.params;
  const stateCode = state.toUpperCase();

  // Validate state
  if (!statuteData[stateCode]) {
    return res.status(404).json({
      error: 'State not found',
      message: `State code '${state}' is not valid. Use 2-letter state codes (e.g., CA, NY, TX).`,
      validStates: '/states'
    });
  }

  // Validate case type
  const validCaseTypes = CASE_TYPES.map(ct => ct.id);
  if (!validCaseTypes.includes(caseType.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid case type',
      message: `Case type '${caseType}' is not valid.`,
      validCaseTypes: validCaseTypes
    });
  }

  const stateInfo = statuteData[stateCode];
  const limitationYears = stateInfo.statuteOfLimitations[caseType.toLowerCase()];

  res.json({
    state: {
      code: stateCode,
      name: stateInfo.name
    },
    caseType: caseType.toLowerCase(),
    statuteOfLimitations: {
      years: limitationYears,
      description: `You have ${limitationYears} year${limitationYears !== 1 ? 's' : ''} from the date of incident to file a ${caseType.replace(/-/g, ' ')} claim in ${stateInfo.name}.`
    },
    disclaimer: 'This information is for informational purposes only and may not reflect the most current legal standards. Always consult with a qualified attorney for legal advice.'
  });
});

/**
 * @api {get} /statute-of-limitations/:state Get All Case Types for State
 * @apiDescription Returns statute of limitations for all case types in a specific state
 */
app.get('/statute-of-limitations/:state', (req, res) => {
  const { state } = req.params;
  const stateCode = state.toUpperCase();

  // Validate state
  if (!statuteData[stateCode]) {
    return res.status(404).json({
      error: 'State not found',
      message: `State code '${state}' is not valid. Use 2-letter state codes (e.g., CA, NY, TX).`,
      validStates: '/states'
    });
  }

  const stateInfo = statuteData[stateCode];

  res.json({
    state: {
      code: stateCode,
      name: stateInfo.name
    },
    statuteOfLimitations: stateInfo.statuteOfLimitations,
    disclaimer: 'This information is for informational purposes only and may not reflect the most current legal standards. Always consult with a qualified attorney for legal advice.'
  });
});

/**
 * @api {get} /average-settlement/:injuryType Get Average Settlement
 * @apiDescription Returns average settlement range for a specific injury type
 * @apiParam {String} injuryType Injury type (slip-and-fall, car-accident, medical-malpractice, workplace-injury)
 */
app.get('/average-settlement/:injuryType', (req, res) => {
  const { injuryType } = req.params;

  // Validate injury type
  const validInjuryTypes = INJURY_TYPES.map(it => it.id);
  if (!validInjuryTypes.includes(injuryType.toLowerCase())) {
    return res.status(400).json({
      error: 'Invalid injury type',
      message: `Injury type '${injuryType}' is not valid.`,
      validInjuryTypes: validInjuryTypes
    });
  }

  const settlement = settlementData[injuryType.toLowerCase()];

  res.json({
    injuryType: injuryType.toLowerCase(),
    displayName: settlement.displayName,
    description: settlement.description,
    averageSettlement: settlement.averageSettlement,
    factors: settlement.factors,
    disclaimer: 'Settlement amounts vary significantly based on individual case circumstances. These figures represent general ranges and should not be considered as guarantees or predictions for any specific case.'
  });
});

/**
 * @api {get} /average-settlements Get All Settlements
 * @apiDescription Returns average settlement data for all injury types
 */
app.get('/average-settlements', (req, res) => {
  const settlements = Object.keys(settlementData).map(key => ({
    injuryType: key,
    displayName: settlementData[key].displayName,
    averageSettlement: settlementData[key].averageSettlement
  }));

  res.json({
    count: settlements.length,
    settlements: settlements
  });
});

/**
 * @api {get} /insurance-coverage/:state Get Insurance Coverage Requirements
 * @apiDescription Returns auto insurance minimum requirements and typical coverage limits for a state
 * @apiParam {String} state State code (e.g., CA, NY, TX)
 */
app.get('/insurance-coverage/:state', (req, res) => {
  const { state } = req.params;
  const stateCode = state.toUpperCase();

  const stateData = insuranceData['auto-insurance-minimums'].states[stateCode];

  if (!stateData) {
    return res.status(404).json({
      error: 'State not found',
      message: `Insurance data for state code '${state}' is not available yet.`,
      availableStates: Object.keys(insuranceData['auto-insurance-minimums'].states),
      disclaimer: 'Insurance data is currently available for select states. More states being added daily.'
    });
  }

  res.json({
    state: {
      code: stateCode,
      name: stateData.state
    },
    autoInsuranceMinimums: {
      bodilyInjuryPerPerson: stateData.bodilyInjuryPerPerson,
      bodilyInjuryPerAccident: stateData.bodilyInjuryPerAccident,
      propertyDamage: stateData.propertyDamage,
      personalInjuryProtection: stateData.personalInjuryProtection || null,
      currency: stateData.currency,
      notes: stateData.notes
    },
    commonPolicyLimits: insuranceData['auto-insurance-minimums'].commonPolicyLimits,
    disclaimer: 'Insurance requirements change periodically. Always verify current requirements with your state DMV and insurance provider.'
  });
});

/**
 * @api {get} /insurance-coverage Get All Insurance Data
 * @apiDescription Returns insurance coverage information overview
 */
app.get('/insurance-coverage', (req, res) => {
  const availableStates = Object.keys(insuranceData['auto-insurance-minimums'].states);

  res.json({
    description: insuranceData['auto-insurance-minimums'].description,
    updated: insuranceData['auto-insurance-minimums'].updated,
    availableStates: {
      count: availableStates.length,
      states: availableStates
    },
    homeowners: insuranceData['homeowners-liability-limits'],
    umbrella: insuranceData['umbrella-policies']
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist.',
    availableEndpoints: ['/', '/states', '/case-types', '/injury-types', '/statute-of-limitations/:state/:caseType', '/average-settlement/:injuryType', '/insurance-coverage/:state']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Legal Data API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
