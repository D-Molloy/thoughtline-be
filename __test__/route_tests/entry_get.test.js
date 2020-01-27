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
        // console.log('mockdata', this.mockdata.entry._id);
      });
  });
  afterAll(() => mocks.target.removeAll());
  afterAll(() => mocks.auth.removeAll());
  afterAll(() => server.stop());


  describe('Get an Entry', () => {
    beforeAll(() => {
      return superagent
        .get(`${api}/entry/${this.mockdata.entry._id}`)
        .set('Authorization', `Bearer ${this.mockdata.target.user.token}`)
        // .query(`id=${this.mockdata.entry._id}`)
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });
    it('should return a 200 status code', () => {
      expect(this.response.status).toBe(200);
    });
    it('should expect an object in the reqponse', () => {
      expect(this.response.body).toBeInstanceOf(Object);
    });
  });
  describe('Get an all entries for user ', () => {
    beforeAll(() => {
      return superagent
        .get(`${api}/entry/`)
        .set('Authorization', `Bearer ${this.mockdata.target.user.token}`)
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });
    it('should return a 200 status code', () => {
      expect(this.response.status).toBe(200);
    });
    it('should expect an array in the reqponse', () => {
      expect(this.response.body).toBeInstanceOf(Array);
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