# Legal Data API

A comprehensive REST API providing legal data for all 50 US states + DC. Perfect for legal tech applications, law firm websites, and legal research tools.

## Live API

**Base URL:** `https://legal-data-api-ubsk.onrender.com`

**RapidAPI Listing:** https://rapidapi.com/lucifersbs/api/legal-data-api

## Endpoints

### 1. Health Check
```
GET /
```
Returns API status and available endpoints.

### 2. Get All States
```
GET /states
```
Returns list of all US states with their codes.

**Response:**
```json
{
  "count": 51,
  "states": [
    { "code": "CA", "name": "California" },
    { "code": "NY", "name": "New York" },
    ...
  ]
}
```

### 3. Get Case Types
```
GET /case-types
```
Returns available case types.

**Response:**
```json
{
  "count": 4,
  "caseTypes": [
    { "id": "personal-injury", "name": "Personal Injury" },
    { "id": "property-damage", "name": "Property Damage" },
    { "id": "wrongful-death", "name": "Wrongful Death" },
    { "id": "medical-malpractice", "name": "Medical Malpractice" }
  ]
}
```

### 4. Get Injury Types
```
GET /injury-types
```
Returns available injury types.

### 5. Statute of Limitations
```
GET /statute-of-limitations/:state/:caseType
```
Returns statute of limitations for a specific state and case type.

**Parameters:**
- `state`: 2-letter state code (e.g., CA, NY, TX)
- `caseType`: personal-injury, property-damage, wrongful-death, medical-malpractice

**Example:**
```
GET /statute-of-limitations/CA/personal-injury
```

**Response:**
```json
{
  "state": { "code": "CA", "name": "California" },
  "caseType": "personal-injury",
  "statuteOfLimitations": {
    "years": 2,
    "description": "You have 2 years from the date of incident to file a personal injury claim in California."
  }
}
```

### 6. Get All Statutes for State
```
GET /statute-of-limitations/:state
```
Returns all statute of limitations for a specific state.

### 7. Average Settlement
```
GET /average-settlement/:injuryType
```
Returns average settlement range for a specific injury type.

**Parameters:**
- `injuryType`: slip-and-fall, car-accident, medical-malpractice, workplace-injury

**Example:**
```
GET /average-settlement/slip-and-fall
```

**Response:**
```json
{
  "injuryType": "slip-and-fall",
  "displayName": "Slip and Fall",
  "averageSettlement": {
    "min": 15000,
    "max": 45000,
    "currency": "USD",
    "median": 30000,
    "typicalRange": "$15,000 - $45,000"
  },
  "factors": ["Severity of injuries", "Property owner's negligence", ...]
}
```

### 8. Get All Settlements
```
GET /average-settlements
```
Returns settlement data for all injury types.

### 9. Insurance Coverage (NEW ✨)
```
GET /insurance-coverage/:state
```
Returns auto insurance minimum requirements and coverage info for a state.

**Parameters:**
- `state`: 2-letter state code

**Example:**
```
GET /insurance-coverage/CA
```

**Response:**
```json
{
  "state": { "code": "CA", "name": "California" },
  "autoInsuranceMinimums": {
    "bodilyInjuryPerPerson": 15000,
    "bodilyInjuryPerAccident": 30000,
    "propertyDamage": 5000,
    "currency": "USD",
    "notes": "15/30/5 minimum coverage"
  },
  "commonPolicyLimits": {
    "low": { "description": "State minimum coverage" },
    "standard": { "description": "Standard recommended coverage" },
    "high": { "description": "High net worth coverage" }
  }
}
```

### 10. Get All Insurance Data
```
GET /insurance-coverage
```
Returns insurance coverage overview and available states.

## Data Coverage

- **51 Jurisdictions**: All 50 US states + Washington DC
- **4 Case Types**: Personal Injury, Property Damage, Wrongful Death, Medical Malpractice
- **4 Injury Types**: Slip & Fall, Car Accident, Medical Malpractice, Workplace Injury
- **10 States Insurance Data**: CA, TX, FL, NY, PA, IL, OH, GA, NC, MI (more added daily)

## Rate Limits

- 100 requests per 15 minutes per IP
- Contact for increased limits

## Error Handling

All errors return JSON with `error` and `message` fields:

```json
{
  "error": "State not found",
  "message": "State code 'XX' is not valid. Use 2-letter state codes (e.g., CA, NY, TX).",
  "validStates": "/states"
}
```

## Disclaimer

All data is for informational purposes only and may not reflect the most current legal standards. Always consult with a qualified attorney for legal advice.

## Tech Stack

- Node.js + Express
- Deployed on Render
- GitHub Integration
- RapidAPI Marketplace

## Daily Updates

This API receives daily data updates with new states, endpoints, and features. Last updated: March 7, 2026

---

**Questions?** Contact via RapidAPI or open an issue on GitHub.
