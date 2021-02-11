/**
 * HTTP assertions made easy via superagent
 * [SuperTest](https://github.com/visionmedia/supertest)
 */
const request = require('supertest');

// Custom shared
const shared = require('@la-manicurista/shared');

// Application
const application = require('../../application');

// Settings
const prefix = 'CaMi';
const prefixNotFound = `${prefix}${prefix}`;
const wrongPrefix = `${prefix}+`;
const name = `Gert`;
const nameNotFound = `${name}${name}`;
const wrongName = `_${prefix}*`;

describe('TypeaheadController', () => {
  it(`/GET ${shared.API_RESOURCES_PREFIX.TYPEAHEAD} popular users`, async (done) =>
    request(application)
      .get(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`)
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(Array.isArray(users)).toBeTruthy();
        expect(users[0].name).toEqual('Fidela');
        done();
      }));

  it(`/GET ${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/${prefix} prefix exists`, async (done) =>
    request(application)
      .get(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/${prefix}`)
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(Array.isArray(users)).toBeTruthy();
        expect(users[0].name.toLowerCase()).toEqual('Cami'.toLowerCase());
        done();
      }));

  it(`/GET ${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/${prefixNotFound} prefix not found`, async (done) =>
    request(application)
      .get(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/${prefixNotFound}`)
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(Array.isArray(users)).toBeTruthy();
        expect(users).toHaveLength(0);
        done();
      }));

  it(`/POST ${shared.API_RESOURCES_PREFIX.TYPEAHEAD} search {"name": "${name}"} and increment popularity(times)`, async (done) =>
    request(application)
      .post(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`)
      .send({ name: name })
      .expect(200)
      .then(({ body }) => {
        const user = body;
        expect(typeof user === 'object').toBeTruthy();
        expect(user.name.toLowerCase()).toEqual(name.toLowerCase());
        expect(user.times).toBeGreaterThan(999);
        done();
      }));

  it(`/POST ${shared.API_RESOURCES_PREFIX.TYPEAHEAD} {"name": "${nameNotFound}"} not found and increment popularity(times) of the users`, async (done) =>
    request(application)
      .post(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`)
      .send({ name: nameNotFound })
      .expect(400)
      .then(() =>
        request(application)
          .post(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`)
          .send({ name: name })
          .expect(200)
          .then(({ body }) => {
            const user = body;
            expect(typeof user === 'object').toBeTruthy();
            expect(user.name.toLowerCase()).toEqual(name.toLowerCase());
            expect(user.times).toBeGreaterThan(1_000);
            done();
          })
      ));

  describe('Validations ', () => {
    it(`/GET ${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/${wrongPrefix} invalid prefix`, async (done) =>
      request(application)
        .get(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}/${wrongPrefix}`)
        .expect(400)
        .then(() => done()));

    it(`/POST ${shared.API_RESOURCES_PREFIX.TYPEAHEAD} required { name: }`, async (done) =>
      request(application)
        .post(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`)
        .expect(500)
        .then(() => done()));

    it(`/POST ${shared.API_RESOURCES_PREFIX.TYPEAHEAD} invalid param { name: "${wrongName}" }`, async (done) =>
      request(application)
        .post(`/${shared.API_RESOURCES_PREFIX.TYPEAHEAD}`)
        .send({ name: wrongName })
        .expect(500)
        .then(() => done()));
  });

  afterAll(async () => await application.close());
});
