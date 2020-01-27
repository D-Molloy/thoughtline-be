'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

let port = process.env.PORT;
let api = `:${port}/api/v1`;
// let token;

describe('Sign up route', () => {
  beforeAll(() => server.start());
  beforeAll(() => {
    return mocks.target.createOne()
      .then(mock => {
        this.mockdata = mock;
        // console.log('mock date target token', this.mockdata.user.token);
      });
  });
  afterAll(() => mocks.target.removeAll());
  afterAll(() => mocks.auth.removeAll());
  afterAll(() => server.stop());


  describe('valid new target', () => {
    beforeAll(() => {
      return superagent.post(`${api}/target/`)
        .set('Authorization', `Bearer ${this.mockdata.user.token}`)
        .send({
          name: 'tessa',
        })
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });
    it('should return a 201 status code', () => {
      expect(this.response.status).toBe(201);
    });
    it('should have a object in the response body', () => {
      expect(this.response.body).toBeInstanceOf(Object);
    });
  });

  describe('Bad POST request for Target route POST', () => {
    beforeAll(() => {
      return superagent
        .get(`${api}/target/`)
        .set('Authorization', `Bearer `)
        .catch(err => this.error = err);
    });
    it('should return a 401 status code', () => {
      expect(this.error.status).toBe(401);
    });
    
  });
  
  
});