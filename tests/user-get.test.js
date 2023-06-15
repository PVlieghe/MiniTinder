/* global apiUrl */
const request = require('supertest');

test('GET /users without jwt', async () => {
  const res = await request(apiUrl).get('/users');

  expect(res.statusCode).toEqual(500);
});

test('GET /users with jwt', async () => {
  let res = await request(apiUrl).post('/auth/login').send({
    firstName: 'Lorem',
    password: 'password',
  });

  expect(res.statusCode).toEqual(200);

  const jwt = res.body.token;

  res = await request(apiUrl).get('/users').set('Authorization', `Bearer ${jwt}`);

  expect(res.statusCode).toEqual(200);
  expect(res.body.length).toEqual(1);
  expect(res.body[0]).toMatchObject({
    id: 'eb9789fd-7925-4f22-9ddd-c5c5225b69f9',
    firstName: 'Lorem',
    lastName: 'Ipsum',
    password: '$2a$12$fN90KmxobuGypSm.apeA5.S8eqvAXk40JZ0DKVIX1cBRQlYqfbu6.',
    isAdmin: true,
  });
});
