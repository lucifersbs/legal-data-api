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

// Extract jurisdictions and metadata from new data structure
const jurisdictions = statuteData.jurisdictions;
const metadata = statuteData.metadata;

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests', retryAfter: '15 minutes' }
});
app.use(limiter);

// RapidAPI headers
app.use((req, res, next) => {
  res.setHeader('X-RapidAPI-Proxy-Response', 'true');
  next();
});

const CASE_TYPES = [
  { id: 'personal-injury', name: 'Personal Injury' },
  { id: 'property-damage', name: 'Property Damage' },
  { id: 'wrongful-death', name: 'Wrongful Death' },
  { id: 'medical-malpractice', name: 'Medical Malpractice' }
];

const INJURY_TYPES = [
  { id: 'slip-and-fall', name: 'Slip and Fall' },
  { id: 'car-accident', name: 'Car Accident' },
  { id: 'medical-malpractice', name: 'Medical Malpractice' },
  { id: 'workplace-injury', name: 'Workplace Injury' }
];

// Health check
app.get('/', (req, res) => {
  res.json({
    name: 'Legal Data API',
    version: '1.0.0',
    status: 'operational',
    dataVersion: metadata?.version || 'unknown'
  });
});

// Get all states
app.get('/states', (req, res) => {
  const states = Object.keys(jurisdictions).map(code => ({
    code: code,
    name: jurisdictions[code].name
  }));
  res.json({ count: states.length, states });
});

// Get case types
app.get('/case-types', (req, res) => {
  res.json({ count: CASE_TYPES.length, caseTypes: CASE_TYPES });
});

// Get injury types
app.get('/injury-types', (req, res) => {
  res.json({ count: INJURY_TYPES.length, injuryTypes: INJURY_TYPES });
});

// Get statute of limitations
app.get('/statute-of-limitations/:state/:caseType', (req, res) => {
  const { state, caseType } = req.params;
  
  if (!jurisdictions[state]) {
    return res.status(404).json({ error: 'State not found', availableStates: Object.keys(jurisdictions) });
  }
  
  if (!jurisdictions[state].caseTypes[caseType]) {
    return res.status(404).json({ error: 'Case type not found', availableTypes: Object.keys(jurisdictions[state].caseTypes) });
  }
  
  const data = jurisdictions[state].caseTypes[caseType];
  res.json({
    state: jurisdictions[state].name,
    stateCode: state,
    caseType: caseType,
    years: data.years,
    notes: data.notes || null
  });
});

// Get all statutes for a state
app.get('/statute-of-limitations/:state', (req, res) => {
  const { state } = req.params;
  
  if (!jurisdictions[state]) {
    return res.status(404).json({ error: 'State not found' });
  }
  
  res.json({
    state: jurisdictions[state].name,
    stateCode: state,
    statutes: jurisdictions[state].caseTypes
  });
});

// Get average settlement
app.get('/average-settlement/:injuryType', (req, res) => {
  const { injuryType } = req.params;
  
  if (!settlementData[injuryType]) {
    return res.status(404).json({ error: 'Injury type not found', availableTypes: Object.keys(settlementData) });
  }
  
  res.json({
    injuryType: injuryType,
    ...settlementData[injuryType]
  });
});

// Get all settlements
app.get('/average-settlements', (req, res) => {
  res.json({
    count: Object.keys(settlementData).length,
    settlements: settlementData
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Legal Data API running on port ${PORT}`);
});

module.exports = app;
