'use strict';


const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

let port = process.env.PORT;
let api = `:${port}/api/v1`;


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


  describe('Delete an Entry', () => {
    beforeAll(() => {
      return superagent
        .delete(`${api}/entry/${this.mockdata.target.target._id}`)
        .set('Authorization', `Bearer ${this.mockdata.target.user.token}`)
        // .query(`id=${this.mockdata.target.target._id}`)
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