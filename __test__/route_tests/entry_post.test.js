'use strict';

const faker = require('faker');
const mocks = require('../lib/mocks');
const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

let port = process.env.PORT;
let api = `:${port}/api/v1`;
// let token;

describe('entry post test ', () => {
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
      return superagent.post(`${api}/entry/`)
        .set('Authorization', `Bearer ${this.mockdata.user.token}`)
        .send({
          recipient: `${this.mockdata.target._id}`,
          mood: faker.lorem.word(),
          description: faker.lorem.words(10),
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

  describe('Bad POST request no bearer token', () => {
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