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

// Load new data files (with error handling)
let courtDeadlines = {};
let legalForms = {};
try {
  courtDeadlines = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'court-deadlines.json'), 'utf8'));
} catch (e) {
  console.log('court-deadlines.json not loaded:', e.message);
}
try {
  legalForms = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'legal-forms.json'), 'utf8'));
} catch (e) {
  console.log('legal-forms.json not loaded:', e.message);
}

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
  
  // Check if caseType exists directly on state object (not nested in caseTypes)
  if (jurisdictions[state][caseType] === undefined) {
    return res.status(404).json({ error: 'Case type not found', availableTypes: Object.keys(jurisdictions[state]).filter(k => k !== 'name') });
  }
  
  const years = jurisdictions[state][caseType];
  res.json({
    state: jurisdictions[state].name,
    stateCode: state,
    caseType: caseType,
    years: years,
    notes: null
  });
});

// Get all statutes for a state
app.get('/statute-of-limitations/:state', (req, res) => {
  const { state } = req.params;
  
  if (!jurisdictions[state]) {
    return res.status(404).json({ error: 'State not found' });
  }
  
  // Filter out 'name' to get only case types
  const statutes = {};
  for (const [key, value] of Object.entries(jurisdictions[state])) {
    if (key !== 'name') {
      statutes[key] = value;
    }
  }
  
  res.json({
    state: jurisdictions[state].name,
    stateCode: state,
    statutes: statutes
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

// Get court deadlines by state
app.get('/court-deadlines/:state', (req, res) => {
  const { state } = req.params;
  
  if (!courtDeadlines.jurisdictions || !courtDeadlines.jurisdictions[state]) {
    return res.status(404).json({ error: 'State not found', availableStates: courtDeadlines.jurisdictions ? Object.keys(courtDeadlines.jurisdictions) : [] });
  }
  
  res.json({
    state: courtDeadlines.jurisdictions[state].name,
    stateCode: state,
    deadlines: courtDeadlines.jurisdictions[state]
  });
});

// Get legal forms by state
app.get('/legal-forms/:state', (req, res) => {
  const { state } = req.params;
  
  if (!legalForms.jurisdictions || !legalForms.jurisdictions[state]) {
    return res.status(404).json({ error: 'State not found', availableStates: legalForms.jurisdictions ? Object.keys(legalForms.jurisdictions) : [] });
  }
  
  res.json({
    state: legalForms.jurisdictions[state].name,
    stateCode: state,
    forms: legalForms.jurisdictions[state]
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
