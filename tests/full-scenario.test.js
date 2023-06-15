/* global apiUrl */
const request = require('supertest');

describe('Test the whole scenario', () => {
  test("Let's go !", async () => {
    // User creation
    let res = await request(apiUrl).post('/users').send({
      firstName: 'FnScenario',
      lastName: 'LnScenario',
      password: 'LnPassword',
      isAdmin: true,
    });

    expect(res.statusCode).toEqual(201);

    // Token creation
    res = await request(apiUrl).post('/auth/login').send({
      firstName: 'FnScenario',
      password: 'LnPassword',
    });

    expect(res.statusCode).toEqual(200);
    const jwt = res.body.token;

    // List users
    res = await request(apiUrl).get('/users').set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);

    // Update user
    const user = res.body.find((user) => user.firstName === 'FnScenario');
    const userId = user.id;
    const newLastName = 'Vittel';
    res = await request(apiUrl).put(`/users/${userId}`).set('Authorization', `Bearer ${jwt}`).send({
      lastName: newLastName,
    });

    expect(res.statusCode).toEqual(204);

    // Get updated user
    res = await request(apiUrl).get('/users/FnScenario').set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.lastName).toEqual(newLastName);

    // Delete user
    res = await request(apiUrl).delete(`/users/${userId}`).set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(204);

    // List users
    res = await request(apiUrl).get('/users').set('Authorization', `Bearer ${jwt}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });
});
