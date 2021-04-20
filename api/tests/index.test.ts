import request from 'supertest';
import app from '../app';

describe('Test the root path', () => {
  test('It should respond to the GET method', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(['respond with a resource']);
  });
});

describe('Test the calculate value path', () => {
  const route = '/calculate-value';
  test('It should respond to empty body sent to POST method', async () => {
    const response = await request(app).post(route);
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        invalidFields: ['firstBand', 'secondBand', 'exponentBand', 'toleranceBand'],
      })
    );
  });
  test('It should respond to invalid color sent to POST method', async () => {
    const response = await request(app)
      .post(route)
      .set('Content-Type', 'application/json')
      .send({
        firstBand: 'transparent',
        secondBand: 'red',
        exponentBand: 'orange',
        toleranceBand: 'gold',
      })
      .set('Accept', 'text/html');
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        invalidFields: ['firstBand'],
      })
    );
  });
  test('It should respond with correct value sent to POST method', async () => {
    const response = await request(app)
      .post(route)
      .set('Content-Type', 'application/json')
      .send({
        firstBand: 'red',
        secondBand: 'red',
        exponentBand: 'orange',
        toleranceBand: 'gold',
      })
      .set('Accept', 'text/html');
    expect(response.status).toBe(200);
    expect(response.text).toBe('22000 ohms ±5%');
  });
});

describe('Test the calculate values path', () => {
  const route = '/calculate-values';
  test('It should respond to empty body sent to POST method', async () => {
    const response = await request(app).post(route);
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        invalidFields: ['firstBand', 'secondBand', 'exponentBand', 'toleranceBand'],
      })
    );
  });
  test('It should respond to invalid color sent to POST method', async () => {
    const response = await request(app)
      .post(route)
      .set('Content-Type', 'application/json')
      .send({
        firstBand: 'transparent',
        secondBand: 'red',
        exponentBand: 'orange',
        toleranceBand: 'gold',
      })
      .set('Accept', 'text/html');
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        invalidFields: ['firstBand'],
      })
    );
  });
  test('It should respond with correct values sent to POST method', async () => {
    const response = await request(app)
      .post(route)
      .set('Content-Type', 'application/json')
      .send({
        firstBand: 'red',
        secondBand: 'red',
        exponentBand: 'orange',
        toleranceBand: 'gold',
      })
      .set('Accept', 'text/html');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({
      baseResistance: 22000,
      maxResistance: 23100,
      mixResistance: 20900,
      tolerance: 5,
    });
  });
});
