'use strict';


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
    return mocks.entry.createOne()
      .then(mock => {
        this.mockdata = mock;
      });
  });
  afterAll(() => mocks.target.removeAll());
  afterAll(() => mocks.auth.removeAll());
  afterAll(() => server.stop());


  describe('Get a created target', () => {
    beforeAll(() => {
      return superagent
        .get(`${api}/targetentry/`)
        .set('Authorization', `Bearer ${this.mockdata.target.user.token}`)
        .send({recipient: `${this.mockdata.target.target._id}`})
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });
    it('should return a 200 status code', () => {
      expect(this.response.status).toBe(200);
    });
    it('should expect an object in the response', () => {
      expect(this.response.body).toBeInstanceOf(Object);
    })
  });
  describe('Bad Request with no bearer token', () => {
    beforeAll(() => {
      return superagent
        .get(`${api}/target/`)
        .set('Authorization', `Bearer`)
        .catch(err => this.error = err);
    });
    it('should return a 401 error code', () => {
      expect(this.error.status).toBe(401);
    });
    
  });
  
  
});