'use strict';

const faker = require('faker');

const superagent = require('superagent');
const server = require('../../lib/server');
require('jest');

let port = process.env.PORT;
let api = `:${port}/api/v1`;

describe('Sign up route', () => {
  beforeAll(() => server.start());
  afterAll(() => server.stop());

  const test = {'username': faker.internet.userName(), 'password': faker.internet.password(), 'email': faker.internet.email()} ;
  const invalidData = { 'username': faker.internet.userName(), 'email':faker.internet.email()};

  describe('valid sign up', () => {
    beforeAll(() => {
      return superagent.post(`${api}/signup`)
        .send(test)
        .then(res => {
          this.response = res;
        })
        .catch(err => console.error(err));
    });

    it('should have a 201 response', () => {
      expect(this.response.status).toBe(201);
    });
    it('should return a token', () => {
      expect(this.response.text).not.toBeNull();
    });
  });
  describe('invalid sign up', () => {
    beforeAll(() => {
      return superagent.post(`${api}/signup`)
        .send(invalidData)
        .catch(err => this.error = err);
    });

    it('should have a 401 response', () => {
      expect(this.error.status).toBe(401);
    });
   
  });
});