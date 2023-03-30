const request = require('supertest');

const app = require('../../server');

describe('POST /auth/login', () => {
  beforeAll(() => {
    console.log('before all');
  });
  beforeEach(() => {
    console.log('before each');
  });
  afterEach(() => {
    console.log('after each');
  });
  afterAll(() => {
    console.log('after all');
  });

  it('should return user and token', async () => {
    const testData = {
      email: 'admin@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });

  it('should return unauthorized error', async () => {
    const testData = {
      email: 'admina@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });

  it('should return unauthorized error', async () => {
    const testData = {
      email: 'admin@example.com',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });
});
