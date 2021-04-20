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
        invalidFields: ['firstBand', 'secondBand', 'exponentBand'],
      })
    );
  });
  test('It should respond to invalid band colors sent to POST method', async () => {
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
  describe('with different number of band colors sent', () => {
    test('It should respond with correct label for minimum band colors sent to POST method', async () => {
      const response = await request(app)
        .post(route)
        .set('Content-Type', 'application/json')
        .send({
          firstBand: 'red',
          secondBand: 'red',
          exponentBand: 'orange',
        })
        .set('Accept', 'text/html');
      expect(response.status).toBe(200);
      expect(response.text).toBe('22000 ohms ±20%');
    });
    test('It should respond with correct label for standard band colors sent to POST method', async () => {
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
    test('It should respond with correct label for maximum  band colors sent to POST method', async () => {
      const response = await request(app)
        .post(route)
        .set('Content-Type', 'application/json')
        .send({
          firstBand: 'green',
          secondBand: 'blue',
          thirdBand: 'black',
          exponentBand: 'black',
          toleranceBand: 'brown',
        })
        .set('Accept', 'text/html');
      expect(response.status).toBe(200);
      expect(response.text).toBe('560 ohms ±1%');
    });
  });
});

describe('Test the calculate values path', () => {
  const route = '/calculate-values';
  test('It should respond to empty body sent to POST method', async () => {
    const response = await request(app).post(route);
    expect(response.status).toBe(400);
    expect(response.text).toBe(
      JSON.stringify({
        invalidFields: ['firstBand', 'secondBand', 'exponentBand'],
      })
    );
  });
  test('It should respond to invalid band colors sent to POST method', async () => {
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
  describe('with different number of band colors sent', () => {
    test('It should respond with correct values for minimum band colors sent to POST method', async () => {
      const response = await request(app)
        .post(route)
        .set('Content-Type', 'application/json')
        .send({
          firstBand: 'red',
          secondBand: 'red',
          exponentBand: 'orange',
        })
        .set('Accept', 'text/html');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        baseResistance: 22000,
        maxResistance: 26400,
        mixResistance: 17600,
        tolerance: 20,
      });
    });
    test('It should respond with correct values for standard band colors sent to POST method', async () => {
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
    test('It should respond with correct values for maximum  band colors sent to POST method', async () => {
      const response = await request(app)
        .post(route)
        .set('Content-Type', 'application/json')
        .send({
          firstBand: 'green',
          secondBand: 'blue',
          thirdBand: 'black',
          exponentBand: 'black',
          toleranceBand: 'brown',
        })
        .set('Accept', 'text/html');
      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual({
        baseResistance: 560,
        maxResistance: 565.6,
        mixResistance: 554.4,
        tolerance: 1,
      });
    });
  });
});
