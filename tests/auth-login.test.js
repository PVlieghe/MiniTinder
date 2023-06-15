/* global apiUrl */
const request = require('supertest');

describe('Success login', () => {
  test('POST /auth/login', async () => {
    const res = await request(apiUrl).post('/auth/login').send({
      firstName: 'Lorem',
      password: 'password',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Failed login', () => {
  test('POST /auth/login => without firstName', async () => {
    const res = await request(apiUrl).post('/auth/login').send({
      password: 'password',
    });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('Property "req.body.firstName": Invalid value. Current value = undefined');
  });

  test('POST /auth/login => with wrong firstName', async () => {
    const res = await request(apiUrl).post('/auth/login').send({
      firstName: 'fake',
      password: 'password',
    });

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized');
  });

  test('POST /auth/login => with wrong password', async () => {
    const res = await request(apiUrl).post('/auth/login').send({
      firstName: 'Lorem',
      password: 'fake',
    });

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized');
  });
});
