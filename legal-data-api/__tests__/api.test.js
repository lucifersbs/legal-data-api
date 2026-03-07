const request = require('supertest');
const app = require('../server');

describe('Legal Data API', () => {
  
  describe('Health Check', () => {
    it('should return API status', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Legal Data API');
      expect(res.body).toHaveProperty('status', 'operational');
    });
  });

  describe('GET /states', () => {
    it('should return all states', async () => {
      const res = await request(app).get('/states');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('states');
      expect(res.body.states.length).toBe(51); // 50 states + DC
    });
  });

  describe('GET /case-types', () => {
    it('should return all case types', async () => {
      const res = await request(app).get('/case-types');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('caseTypes');
      expect(res.body.caseTypes.length).toBe(4);
    });
  });

  describe('GET /injury-types', () => {
    it('should return all injury types', async () => {
      const res = await request(app).get('/injury-types');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('injuryTypes');
      expect(res.body.injuryTypes.length).toBe(4);
    });
  });

  describe('GET /statute-of-limitations/:state/:caseType', () => {
    it('should return statute for valid state and case type', async () => {
      const res = await request(app).get('/statute-of-limitations/CA/personal-injury');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('state');
      expect(res.body.state.code).toBe('CA');
      expect(res.body).toHaveProperty('statuteOfLimitations');
      expect(res.body.statuteOfLimitations).toHaveProperty('years');
    });

    it('should return 404 for invalid state', async () => {
      const res = await request(app).get('/statute-of-limitations/XX/personal-injury');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'State not found');
    });

    it('should return 400 for invalid case type', async () => {
      const res = await request(app).get('/statute-of-limitations/CA/invalid-type');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid case type');
    });
  });

  describe('GET /statute-of-limitations/:state', () => {
    it('should return all case types for a state', async () => {
      const res = await request(app).get('/statute-of-limitations/NY');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('statuteOfLimitations');
      expect(Object.keys(res.body.statuteOfLimitations).length).toBe(4);
    });
  });

  describe('GET /average-settlement/:injuryType', () => {
    it('should return settlement data for valid injury type', async () => {
      const res = await request(app).get('/average-settlement/car-accident');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('injuryType', 'car-accident');
      expect(res.body).toHaveProperty('averageSettlement');
      expect(res.body.averageSettlement).toHaveProperty('min');
      expect(res.body.averageSettlement).toHaveProperty('max');
    });

    it('should return 400 for invalid injury type', async () => {
      const res = await request(app).get('/average-settlement/invalid-injury');
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid injury type');
    });
  });

  describe('GET /average-settlements', () => {
    it('should return all settlement data', async () => {
      const res = await request(app).get('/average-settlements');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('settlements');
      expect(res.body.settlements.length).toBe(4);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/unknown-route');
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error', 'Not Found');
    });
  });
});
