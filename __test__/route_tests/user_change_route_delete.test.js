'use strict';


const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

let port = process.env.PORT;
let api = `:${port}/api/v1`;
// let token;

describe('User Change Route', () => {
  beforeAll(() => server.start());
  beforeAll(() => {
    return mocks.auth.createOne()
      .then(mock => {
        this.mockdata = mock;
        // console.log('mockdata', this.mockdata.token);
      });
  });
 
  afterAll(() => mocks.auth.removeAll());
  afterAll(() => server.stop());


  describe('Get a created User', () => {
    beforeAll(() => {
      return superagent
        .delete(`${api}/user/`)
        .set('Authorization', `Bearer ${this.mockdata.token}`)
        
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });
    it('should return a 204 status code', () => {
      expect(this.response.status).toBe(204);
    });
    
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