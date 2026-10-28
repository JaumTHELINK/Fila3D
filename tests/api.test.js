const request = require('supertest');

const app = require('../src/app');

describe('API', () => {
  it('returns a healthy status from the health endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns a 404 for an unknown route', async () => {
    const response = await request(app).get('/api/rota-inexistente');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ erro: 'Rota não encontrada' });
  });
});
