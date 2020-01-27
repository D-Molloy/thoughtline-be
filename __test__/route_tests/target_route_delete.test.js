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
        // console.log('mock date target token', this.mockdata.target._id);
      });
  });
  
  afterAll(() => mocks.auth.removeAll());
  afterAll(() => server.stop());


  describe('Delete a created target', () => {
    beforeAll(() => {
      return superagent
        .delete(`${api}/target/${this.mockdata.target._id}`)
        // .query(`id=${this.mockdata.target._id}`)
        .set('Authorization', `Bearer ${this.mockdata.user.token}`)
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });
    it('should return a 204 status code', () => {
      expect(this.response.status).toBe(204);
    });
  });

  describe('Bad Delete request for Target route DELETE', () => {
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