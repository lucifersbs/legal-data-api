# ⚖️ Legal Data API

> **The most comprehensive legal data resource for developers building legal tech applications**

[![RapidAPI](https://img.shields.io/badge/RapidAPI-Available-0055D4?style=for-the-badge&logo=rapidapi&logoColor=white)](https://rapidapi.com/your-api-provider/legal-data-api)
[![Version](https://img.shields.io/badge/Version-2.0.0-00C853?style=for-the-badge)](https://github.com/lucifersbs/legal-data-api)
[![License](https://img.shields.io/badge/License-MIT-FF6D00?style=for-the-badge)](LICENSE)

Transform your legal tech applications with instant access to **50+ states** of legal data, **20+ specialized endpoints**, and comprehensive coverage of statute of limitations, damages caps, comparative negligence rules, settlement data, and much more.

---

## 🎯 Why Legal Data API?

Legal Data API is the **definitive legal data platform** trusted by law firms, legal tech startups, insurance companies, and case management software providers. Our API delivers accurate, up-to-date legal information covering all 50 US states plus DC.

### Key Benefits

- ⚡ **Instant Integration** — RESTful JSON API ready in minutes
- 📊 **Comprehensive Coverage** — 20+ endpoints covering every major legal data category
- 🔄 **Daily Updates** — Data refreshed continuously as laws change
- 🛡️ **99.9% Uptime SLA** — Enterprise-grade reliability
- 💰 **Flexible Pricing** — Free tier available, scale as you grow

---

## 🚀 Features

### 📋 Core Legal Data
| Feature | Description | Coverage |
|---------|-------------|----------|
| **Statute of Limitations** | Filing deadlines for all case types | All 50 states + DC |
| **Damages Caps** | Non-economic, punitive, and malpractice limits | All 50 states + DC |
| **Comparative Negligence** | Fault rules and recovery thresholds | All 50 states + DC |
| **Settlement Data** | Average settlement ranges by injury type | National data |

### 🏛️ Court & Procedural Data
| Feature | Description | Coverage |
|---------|-------------|----------|
| **Court Information** | State court structures and jurisdictions | All 50 states + DC |
| **State Courts** | Detailed court system hierarchies | All 50 states + DC |
| **Filing Fees** | Court costs by case type and state | All 50 states + DC |
| **Evidence Rules** | State-specific evidence requirements | All 50 states + DC |

### 💼 Practice Management Data
| Feature | Description | Coverage |
|---------|-------------|----------|
| **Attorney Fees** | Fee structures and guidelines | National + State-specific |
| **Expert Witness Fees** | Average costs by specialty | 25+ specialties |
| **Jury Verdicts** | Historical verdict data by state/case type | All 50 states |
| **Precedent Cases** | Landmark cases by practice area | Major case types |

### 🏥 Specialized Data
| Feature | Description | Coverage |
|---------|-------------|----------|
| **Workers Compensation** | State-specific WC rules and rates | All 50 states + DC |
| **Insurance Requirements** | Minimum coverage requirements | All 50 states + DC |
| **Alternative Dispute Resolution** | Mediation and arbitration rules | All 50 states + DC |
| **Statute Citations** | Legal citations for SOL rules | All 50 states + DC |

---

## 📚 API Reference

### Base URL
```
https://legal-data-api.p.rapidapi.com
```

### Authentication
All API requests require a RapidAPI key:
```
X-RapidAPI-Key: YOUR_API_KEY
X-RapidAPI-Host: legal-data-api.p.rapidapi.com
```

---

## 🔌 Endpoints

### 🏠 System Endpoints

#### Health Check
```http
GET /
```
Returns API status and available endpoints.

**Response:**
```json
{
  "name": "Legal Data API",
  "version": "2.0.0",
  "status": "operational",
  "endpoints": {
    "statuteOfLimitations": "/statute-of-limitations/:state/:caseType",
    "averageSettlement": "/average-settlement/:injuryType",
    "states": "/states",
    "caseTypes": "/case-types"
  },
  "documentation": "https://rapidapi.com/your-api-provider/legal-data-api"
}
```

---

### 📍 Reference Data Endpoints

#### List All States
```http
GET /states
```
Returns all US states with their 2-letter codes.

**Response:**
```json
{
  "count": 51,
  "states": [
    { "code": "AL", "name": "Alabama" },
    { "code": "AK", "name": "Alaska" },
    { "code": "AZ", "name": "Arizona" }
  ]
}
```

#### List Case Types
```http
GET /case-types
```
Returns available case types for statute of limitations lookups.

**Response:**
```json
{
  "count": 4,
  "caseTypes": [
    {
      "id": "personal-injury",
      "name": "Personal Injury",
      "description": "Physical injuries to a person"
    },
    {
      "id": "property-damage",
      "name": "Property Damage",
      "description": "Damage to personal or real property"
    },
    {
      "id": "wrongful-death",
      "name": "Wrongful Death",
      "description": "Death caused by negligence or misconduct"
    },
    {
      "id": "medical-malpractice",
      "name": "Medical Malpractice",
      "description": "Negligence by healthcare professionals"
    }
  ]
}
```

#### List Injury Types
```http
GET /injury-types
```
Returns available injury types for settlement data.

**Response:**
```json
{
  "count": 4,
  "injuryTypes": [
    { "id": "slip-and-fall", "name": "Slip and Fall" },
    { "id": "car-accident", "name": "Car Accident" },
    { "id": "medical-malpractice", "name": "Medical Malpractice" },
    { "id": "workplace-injury", "name": "Workplace Injury" }
  ]
}
```

---

### ⏱️ Statute of Limitations Endpoints

#### Get SOL for Specific State and Case Type
```http
GET /statute-of-limitations/:state/:caseType
```

**Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `state` | string | 2-letter state code | `CA`, `NY`, `TX` |
| `caseType` | string | Case type ID | `personal-injury`, `medical-malpractice` |

**Example Request:**
```bash
curl -X GET "https://legal-data-api.p.rapidapi.com/statute-of-limitations/CA/personal-injury" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: legal-data-api.p.rapidapi.com"
```

**Response:**
```json
{
  "state": {
    "code": "CA",
    "name": "California"
  },
  "caseType": "personal-injury",
  "statuteOfLimitations": {
    "years": 2,
    "description": "You have 2 years from the date of incident to file a personal injury claim in California."
  },
  "disclaimer": "This information is for informational purposes only and may not reflect the most current legal standards. Always consult with a qualified attorney for legal advice."
}
```

#### Get All SOL for State
```http
GET /statute-of-limitations/:state
```
Returns all case types and their statutes for a specific state.

**Example Response:**
```json
{
  "state": {
    "code": "NY",
    "name": "New York"
  },
  "statuteOfLimitations": {
    "personal-injury": 3,
    "property-damage": 3,
    "wrongful-death": 2,
    "medical-malpractice": 2.5
  },
  "disclaimer": "This information is for informational purposes only..."
}
```

#### Get Statute Citations
```http
GET /statute-citations/:state/:caseType
```
Returns legal citations for statute of limitations rules.

---

### 💰 Damages & Settlement Endpoints

#### Get State Damages Caps
```http
GET /damages/:state
```
Returns all damage caps for a specific state.

**Example Response:**
```json
{
  "state": {
    "code": "CA",
    "name": "California"
  },
  "damages": {
    "nonEconomicDamagesCap": {
      "medicalMalpracticeOnly": true,
      "limit": 250000,
      "rule": "$250,000 cap on non-economic damages in medical malpractice cases (MICRA)"
    },
    "punitiveDamagesCap": null,
    "medicalMalpracticeCap": {
      "nonEconomic": 250000,
      "notes": "MICRA limits non-economic damages to $250,000"
    },
    "wrongfulDeathCap": null,
    "sovereignImmunityCap": null,
    "notes": "Prop 46 (2014) attempted to raise med mal cap but failed"
  }
}
```

#### Get Average Settlement
```http
GET /average-settlement/:injuryType
```

**Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `injuryType` | string | Injury type ID | `car-accident`, `slip-and-fall` |

**Example Response:**
```json
{
  "injuryType": "car-accident",
  "displayName": "Car Accident",
  "description": "Motor vehicle collision injuries",
  "averageSettlement": {
    "min": 15000,
    "max": 75000,
    "median": 35000,
    "currency": "USD"
  },
  "factors": [
    "Severity of injuries",
    "Medical expenses",
    "Lost wages",
    "Property damage",
    "Pain and suffering"
  ],
  "disclaimer": "Settlement amounts vary significantly based on individual case circumstances..."
}
```

#### Get All Settlements
```http
GET /average-settlements
```
Returns summary data for all injury types.

---

### ⚖️ Negligence Rules Endpoints

#### Get Comparative Negligence Rules
```http
GET /comparative-negligence/:state
```
Returns fault system rules for a specific state.

**Example Response:**
```json
{
  "state": {
    "code": "CA",
    "name": "California"
  },
  "faultSystem": "pure comparative negligence",
  "faultSystemDescription": "Plaintiff can recover damages reduced by their percentage of fault, even if more than 50% at fault",
  "barThreshold": null,
  "barThresholdType": "no bar",
  "pureComparative": true,
  "modifiedComparativeType": null,
  "notes": "California is a pure comparative negligence state (Li v. Yellow Cab Co., 1975)"
}
```

---

### 🏛️ Court System Endpoints

#### Get Court Information
```http
GET /court-info/:state
```
Returns general court information for a state.

#### Get State Courts Hierarchy
```http
GET /state-courts/:state
```
Returns detailed court system structure.

#### Get Filing Fees
```http
GET /filing-fees/:state/:caseType
```
Returns court filing fees by state and case type.

#### Get Jury Verdicts
```http
GET /jury-verdicts/:state/:caseType
```
Returns historical jury verdict data.

---

### 💼 Practice Management Endpoints

#### Get Attorney Fees
```http
GET /attorney-fees/:feeType/:caseType
```
Returns fee structures and guidelines.

**Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `feeType` | string | Fee arrangement | `contingency`, `hourly`, `flat-fee` |
| `caseType` | string | Case type ID | `personal-injury` |

#### Get Expert Witness Fees
```http
GET /expert-witness-fees/:specialty
```
Returns average expert witness costs by specialty.

**Example Response:**
```json
{
  "specialty": "medical-expert",
  "displayName": "Medical Expert Witness",
  "hourlyRate": {
    "min": 300,
    "max": 800,
    "median": 500,
    "currency": "USD"
  },
  "dailyRate": {
    "min": 2500,
    "max": 6000,
    "median": 4000,
    "currency": "USD"
  },
  "retainer": {
    "typical": 5000,
    "currency": "USD"
  }
}
```

#### Get Precedent Cases
```http
GET /precedent-cases/:caseType
```
Returns landmark precedent cases by practice area.

---

### 📋 Specialized Data Endpoints

#### Get Workers Compensation Info
```http
GET /workers-comp/:state
```
Returns workers compensation rules and rates.

#### Get Evidence Rules
```http
GET /evidence-rules/:state
```
Returns state-specific evidence requirements.

#### Get Insurance Requirements
```http
GET /insurance-requirements/:state
```
Returns minimum insurance coverage requirements.

#### Get Alternative Dispute Resolution
```http
GET /alternative-dispute/:state
```
Returns mediation and arbitration rules.

---

## 💻 Usage Examples

### cURL Examples

#### Get California Personal Injury SOL
```bash
curl -X GET "https://legal-data-api.p.rapidapi.com/statute-of-limitations/CA/personal-injury" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: legal-data-api.p.rapidapi.com"
```

#### Get Texas Damages Caps
```bash
curl -X GET "https://legal-data-api.p.rapidapi.com/damages/TX" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: legal-data-api.p.rapidapi.com"
```

#### Get New York Comparative Negligence Rules
```bash
curl -X GET "https://legal-data-api.p.rapidapi.com/comparative-negligence/NY" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: legal-data-api.p.rapidapi.com"
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://legal-data-api.p.rapidapi.com/statute-of-limitations/FL/personal-injury',
  headers: {
    'X-RapidAPI-Key': 'YOUR_API_KEY',
    'X-RapidAPI-Host': 'legal-data-api.p.rapidapi.com'
  }
};

try {
  const response = await axios.request(options);
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

### Python

```python
import requests

url = "https://legal-data-api.p.rapidapi.com/damages/CA"

headers = {
    "X-RapidAPI-Key": "YOUR_API_KEY",
    "X-RapidAPI-Host": "legal-data-api.p.rapidapi.com"
}

response = requests.get(url, headers=headers)
print(response.json())
```

### PHP

```php
<?php
$curl = curl_init();

curl_setopt_array($curl, [
  CURLOPT_URL => "https://legal-data-api.p.rapidapi.com/comparative-negligence/NY",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "X-RapidAPI-Key: YOUR_API_KEY",
    "X-RapidAPI-Host: legal-data-api.p.rapidapi.com"
  ],
]);

$response = curl_exec($curl);
curl_close($curl);

echo $response;
```

---

## 📦 Installation & Deployment

### Prerequisites
- Node.js 14+ installed
- npm or yarn

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/lucifersbs/legal-data-api.git
cd legal-data-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

4. **Test locally**
```bash
curl http://localhost:3000/
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=production
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |

---

## 🚀 Deployment Options

### Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create new app
heroku create your-legal-api

# Deploy
git push heroku main
```

### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Render
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select Node.js environment
4. Deploy automatically on push

### Docker
```bash
# Build image
docker build -t legal-data-api .

# Run container
docker run -p 3000:3000 legal-data-api
```

---

## 💰 Pricing

### Free Tier — $0/month
- **100 requests/day**
- Basic endpoints access
- Community support
- Perfect for testing & development

### Starter — $19/month
- **10,000 requests/month**
- All endpoints included
- Standard support
- 99.5% uptime SLA
- Rate limit: 100/minute

### Pro — $79/month
- **100,000 requests/month**
- All endpoints + priority access
- Email support
- 99.9% uptime SLA
- Rate limit: 500/minute
- Custom headers

### Enterprise — $299/month
- **Unlimited requests**
- All endpoints + beta features
- Priority support + dedicated channel
- 99.99% uptime SLA
- Custom rate limits
- SLA guarantees
- White-label options

[Subscribe on RapidAPI](https://rapidapi.com/your-api-provider/legal-data-api/pricing)

---

## 🆕 What's New

### February 13, 2025 — v2.0.0 Major Release 🎉

We're thrilled to announce the biggest update in Legal Data API history! This release adds **12 new endpoints** and significantly expands our data coverage.

#### ✨ New Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /damages/:state` | State-specific damage caps and limits |
| `GET /comparative-negligence/:state` | Fault rules for all 50 states |
| `GET /court-info/:state` | Court system information |
| `GET /workers-comp/:state` | Workers compensation data |
| `GET /filing-fees/:state/:caseType` | Court filing costs |
| `GET /jury-verdicts/:state/:caseType` | Historical verdict ranges |
| `GET /expert-witness-fees/:specialty` | Expert witness rate data |
| `GET /attorney-fees/:feeType/:caseType` | Fee structure guidelines |
| `GET /precedent-cases/:caseType` | Landmark case citations |
| `GET /state-courts/:state` | Detailed court hierarchies |
| `GET /alternative-dispute/:state` | ADR rules and procedures |
| `GET /evidence-rules/:state` | State evidence requirements |
| `GET /insurance-requirements/:state` | Insurance minimums |
| `GET /statute-citations/:state/:caseType` | Legal statute citations |

#### 📊 Data Updates
- **Damages Data**: Added comprehensive coverage for all 50 states + DC
- **Comparative Negligence**: Complete fault system data with descriptions
- **Settlement Data**: Expanded with median values and additional factors

#### 🚀 Improvements
- Enhanced error messages with helpful suggestions
- Improved rate limiting with better headers
- Added more detailed state information
- Faster response times for all endpoints

---

### February 10, 2025 — v1.1.0
- Added comparative negligence data (all 50 states)
- Added damages caps data (all 50 states)
- Improved API documentation

### February 5, 2025 — v1.0.0
- Initial public release
- Core statute of limitations endpoints
- Settlement data endpoints
- RapidAPI integration

---

## 🔗 Links & Resources

- 🌐 **Live API**: [RapidAPI Marketplace](https://rapidapi.com/your-api-provider/legal-data-api)
- 📖 **Full Documentation**: [docs.legaldataapi.com](https://docs.legaldataapi.com)
- 💬 **Support**: support@legaldataapi.com
- 🐦 **Twitter**: [@LegalDataAPI](https://twitter.com/LegalDataAPI)
- 💼 **LinkedIn**: [Legal Data API](https://linkedin.com/company/legal-data-api)

---

## 📊 API Status

| Service | Status |
|---------|--------|
| Core API | ✅ Operational |
| Data Updates | ✅ Operational |
| Documentation | ✅ Operational |

[View Status Page](https://status.legaldataapi.com)

---

## 🤝 Support

- 📧 **Email**: support@legaldataapi.com
- 💬 **Live Chat**: Available for Pro and Enterprise plans
- 📚 **Knowledge Base**: [help.legaldataapi.com](https://help.legaldataapi.com)

---

## ⚖️ Legal Disclaimer

The information provided by the Legal Data API is for **informational purposes only** and does not constitute legal advice. While we strive to maintain accurate and up-to-date information, laws change frequently and vary by jurisdiction. 

**Always consult with a qualified attorney** licensed in the relevant jurisdiction before making legal decisions. The API and its creators are not responsible for any actions taken based on the information provided.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ⚖️ for the legal tech community**

[Subscribe on RapidAPI](https://rapidapi.com/your-api-provider/legal-data-api) • [GitHub](https://github.com/lucifersbs/legal-data-api) • [Documentation](https://docs.legaldataapi.com)

</div>
