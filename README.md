# Legal Data API

The most comprehensive US legal data API. Access 20+ endpoints covering statute of limitations, damage caps, jury verdicts, attorney fees, court systems, and more for all 50 US states.

## 🚀 NEW ENDPOINTS (Feb 2026)

### Court & Filing Data
- `GET /court-deadlines/:state` - Court filing deadlines (motion, discovery, appeal)
- `GET /legal-forms/:state` - Legal form fees and e-filing info
- `GET /court-info/:state` - Court locations and procedures

### Workers Compensation
- `GET /workers-comp/:state` - Workers comp deadlines by state

## Quick Start

```bash
curl https://legal-data-api-ubsk.onrender.com/states
```

## All Endpoints

### Reference Data
- `GET /states` - All 50 states + DC
- `GET /case-types` - Available legal case types
- `GET /injury-types` - Injury types for settlements

### Statute of Limitations
- `GET /statute-of-limitations/:state/:caseType`
- `GET /statute-of-limitations/:state` (all types)
- `GET /statute-citations/:state/:caseType`

### Damages & Settlements
- `GET /damages/:state` - Damage caps by state
- `GET /average-settlement/:injuryType`
- `GET /average-settlements` (all types)

### Negligence Rules
- `GET /comparative-negligence/:state` - Fault allocation rules

### Court Systems
- `GET /court-info/:state` - Court information
- `GET /state-courts/:state` - Court structure
- `GET /filing-fees/:state/:caseType` - Filing fees
- `GET /court-deadlines/:state` - Court deadlines ⭐ NEW
- `GET /legal-forms/:state` - Legal forms & fees ⭐ NEW

### Workers Compensation
- `GET /workers-comp/:state` - WC deadlines

### Practice Management
- `GET /attorney-fees/:feeType/:caseType`
- `GET /expert-witness-fees/:specialty`
- `GET /precedent-cases/:caseType`

## Pricing

- **Free**: 100 requests/month
- **Basic**: $19/month - 10,000 requests
- **Pro**: $79/month - 50,000 requests

## Links

- **Live API**: https://legal-data-api-ubsk.onrender.com
- **RapidAPI**: https://rapidapi.com/lucifersbs/api/legal-data-api
- **GitHub**: https://github.com/lucifersbs/legal-data-api

---

*Updated daily with new legal data*
