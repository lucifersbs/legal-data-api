# Legal Data API

A comprehensive REST API providing legal reference data for all 50 US states and Washington DC. Access statute of limitations, court rules, and other essential legal information programmatically.

[![RapidAPI](https://img.shields.io/badge/RapidAPI-Subscribe-0055D4?style=flat&logo=rapidapi)](https://rapidapi.com/your-api-here)

## 🚀 Features

- **Complete Coverage**: All 50 US states + Washington DC
- **4 Claim Types**: Personal injury, property damage, wrongful death, medical malpractice
- **RESTful Design**: Simple, predictable URLs and JSON responses
- **Fast & Reliable**: Optimized for production use
- **Well Documented**: Clear examples and response schemas

## 📋 Available Endpoints

### Base URL
```
https://api.legaldata.example/v1
```

### 1. Get All Jurisdictions
Retrieve statute of limitations data for all states.

**Endpoint:** `GET /statute-of-limitations`

**Example Request:**
```bash
curl -X GET "https://api.legaldata.example/v1/statute-of-limitations" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "metadata": {
    "title": "US Statute of Limitations by State",
    "description": "Statute of limitations periods for common legal claims",
    "lastUpdated": "2026-02-12",
    "totalJurisdictions": 51
  },
  "jurisdictions": {
    "CA": {
      "name": "California",
      "personal-injury": 2,
      "property-damage": 3,
      "wrongful-death": 2,
      "medical-malpractice": 3
    },
    "NY": {
      "name": "New York",
      "personal-injury": 3,
      "property-damage": 3,
      "wrongful-death": 2,
      "medical-malpractice": 3
    }
    ...
  }
}
```

---

### 2. Get Specific State
Retrieve data for a single state by its two-letter code.

**Endpoint:** `GET /statute-of-limitations/{state}`

**Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `state` | string | Two-letter state code | `CA`, `NY`, `TX` |

**Example Request:**
```bash
curl -X GET "https://api.legaldata.example/v1/statute-of-limitations/CA" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "state": "CA",
  "name": "California",
  "personal-injury": 2,
  "property-damage": 3,
  "wrongful-death": 2,
  "medical-malpractice": 3
}
```

---

### 3. Get Specific Claim Type
Retrieve statute of limitations for a specific claim type across all states.

**Endpoint:** `GET /statute-of-limitations/claim/{claim-type}`

**Parameters:**
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `claim-type` | string | Type of legal claim | `personal-injury`, `property-damage`, `wrongful-death`, `medical-malpractice` |

**Example Request:**
```bash
curl -X GET "https://api.legaldata.example/v1/statute-of-limitations/claim/personal-injury" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "claimType": "personal-injury",
  "description": "Statute of limitations for personal injury claims in years",
  "jurisdictions": {
    "CA": { "name": "California", "limit": 2 },
    "NY": { "name": "New York", "limit": 3 },
    "TX": { "name": "Texas", "limit": 2 },
    "FL": { "name": "Florida", "limit": 4 }
    ...
  }
}
```

---

### 4. Compare States
Compare statute of limitations between multiple states.

**Endpoint:** `GET /statute-of-limitations/compare`

**Query Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `states` | string | Yes | Comma-separated state codes | `CA,NY,TX,FL` |
| `claim` | string | No | Filter by claim type | `personal-injury` |

**Example Request:**
```bash
curl -X GET "https://api.legaldata.example/v1/statute-of-limitations/compare?states=CA,NY,TX&claim=personal-injury" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Response:**
```json
{
  "comparison": {
    "states": ["CA", "NY", "TX"],
    "claimType": "personal-injury",
    "results": {
      "CA": { "name": "California", "limit": 2 },
      "NY": { "name": "New York", "limit": 3 },
      "TX": { "name": "Texas", "limit": 2 }
    }
  }
}
```

## 📊 Claim Types Reference

| Claim Type | Description | Typical Range |
|------------|-------------|---------------|
| `personal-injury` | Negligence, accidents, intentional torts | 1-6 years |
| `property-damage` | Damage to real or personal property | 2-6 years |
| `wrongful-death` | Claims by survivors for death caused by negligence | 1-3 years |
| `medical-malpractice` | Professional negligence by healthcare providers | 1-4 years |

## 🛠️ Deployment

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API key from RapidAPI (for production)

### Local Development

1. **Clone the repository:**
```bash
git clone https://github.com/lucifersbs/legal-data-api.git
cd legal-data-api
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Production Deployment

#### Option 1: Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

#### Option 2: Deploy to Railway
```bash
npm i -g @railway/cli
railway login
railway up
```

#### Option 3: Docker Deployment
```bash
# Build the image
docker build -t legal-data-api .

# Run the container
docker run -p 3000:3000 --env-file .env legal-data-api
```

## 🔗 RapidAPI Marketplace

This API is available on the RapidAPI marketplace for easy integration:

➡️ **[Subscribe on RapidAPI](https://rapidapi.com/your-api-here)**

Benefits of using RapidAPI:
- **Free tier** available for development
- **Usage analytics** and monitoring
- **Multiple SDKs** (JavaScript, Python, PHP, Ruby, etc.)
- **Enterprise support** available

## ⚖️ Legal Disclaimer

> **IMPORTANT:** The data provided by this API is for informational purposes only. Statutes of limitations are subject to change and may have numerous exceptions, tolling provisions, and special circumstances not captured here. 
>
> - Always verify information with current state law
> - Consult with a qualified attorney for legal advice
> - This API does not constitute legal advice
> - The maintainers are not liable for any decisions made based on this data

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/lucifersbs/legal-data-api/issues)
- **RapidAPI:** Support through RapidAPI dashboard

---

<p align="center">Made with ⚖️ for the legal tech community</p>
