import request from 'supertest';
import app from '../src/app';

describe('/healthcheck', () => {
  it('Responds with 200', async () => {
    await request(app)
      .get('/healthcheck')
      .expect(200);
  })
});