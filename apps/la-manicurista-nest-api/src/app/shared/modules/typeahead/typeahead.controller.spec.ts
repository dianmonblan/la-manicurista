import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

/**
 * HTTP assertions made easy via superagent
 * [SuperTest](https://github.com/visionmedia/supertest)
 */
import * as request from 'supertest';

// Custom controllers
import { TypeaheadController } from './typeahead.controller';

// Custom shared
import {
  API_RESOURCES_PREFIX,
  TypeaheadService,
  UserModel,
} from '@la-manicurista/shared';

// Settings
const prefix: string = 'CaMi';
const prefixNotFound: string = `${prefix}${prefix}`;
const wrongPrefix: string = `${prefix}+`;
const name: string = `Gert`;
const nameNotFound: string = `${name}${name}`;
const wrongName: string = `_${prefix}*`;

describe('TypeaheadController', () => {
  let typeaheadModule: TestingModule, application: INestApplication;

  beforeAll(async () => {
    typeaheadModule = await Test.createTestingModule({
      controllers: [TypeaheadController],
      providers: [TypeaheadService],
    }).compile();

    application = typeaheadModule.createNestApplication();
    await application.init();
  });

  it(`/GET ${API_RESOURCES_PREFIX.TYPEAHEAD} popular users`, (done: Function) =>
    request(application.getHttpServer())
      .get(`/${API_RESOURCES_PREFIX.TYPEAHEAD}`)
      .expect(200)
      .then(({ body }: Response) => {
        const users: UserModel[] = (body as unknown) as UserModel[];
        expect(Array.isArray(users)).toBeTruthy();
        expect(users[0].name).toEqual('Fidela');
        done();
      }));

  it(`/GET ${API_RESOURCES_PREFIX.TYPEAHEAD}/${prefix} prefix exists`, (done: Function) =>
    request(application.getHttpServer())
      .get(`/${API_RESOURCES_PREFIX.TYPEAHEAD}/${prefix}`)
      .expect(200)
      .then(({ body }: Response) => {
        const users: UserModel[] = (body as unknown) as UserModel[];
        expect(Array.isArray(users)).toBeTruthy();
        expect(users[0].name.toLowerCase()).toEqual('Cami'.toLowerCase());
        done();
      }));

  it(`/GET ${API_RESOURCES_PREFIX.TYPEAHEAD}/${prefixNotFound} prefix not found`, (done: Function) =>
    request(application.getHttpServer())
      .get(`/${API_RESOURCES_PREFIX.TYPEAHEAD}/${prefixNotFound}`)
      .expect(200)
      .then(({ body }: Response) => {
        const users: UserModel[] = (body as unknown) as UserModel[];
        expect(Array.isArray(users)).toBeTruthy();
        expect(users).toHaveLength(0);
        done();
      }));

  it(`/POST ${API_RESOURCES_PREFIX.TYPEAHEAD} search {"name": "${name}"} and increment popularity(times)`, (done: Function) =>
    request(application.getHttpServer())
      .post(`/${API_RESOURCES_PREFIX.TYPEAHEAD}`)
      .send({ name: name })
      .expect(201)
      .then(({ body }: Response) => {
        const user: UserModel = (body as unknown) as UserModel;
        expect(typeof user === 'object').toBeTruthy();
        expect(user.name.toLowerCase()).toEqual(name.toLowerCase());
        expect(user.times).toBeGreaterThan(999);
        done();
      }));

  it(`/POST ${API_RESOURCES_PREFIX.TYPEAHEAD} {"name": "${nameNotFound}"} not found and increment popularity(times) of the users`, (done: Function) =>
    request(application.getHttpServer())
      .post(`/${API_RESOURCES_PREFIX.TYPEAHEAD}`)
      .send({ name: nameNotFound })
      .expect(400)
      .then(() =>
        request(application.getHttpServer())
          .post(`/${API_RESOURCES_PREFIX.TYPEAHEAD}`)
          .send({ name: name })
          .expect(201)
          .then(({ body }: Response) => {
            const user: UserModel = (body as unknown) as UserModel;
            expect(typeof user === 'object').toBeTruthy();
            expect(user.name.toLowerCase()).toEqual(name.toLowerCase());
            expect(user.times).toBeGreaterThan(1_000);
            done();
          })
      ));

  describe('Validations ', () => {
    it(`/GET ${API_RESOURCES_PREFIX.TYPEAHEAD}/${wrongPrefix} invalid prefix`, (done: Function) =>
      request(application.getHttpServer())
        .get(`/${API_RESOURCES_PREFIX.TYPEAHEAD}/${wrongPrefix}`)
        .expect(400, done));

    it(`/POST ${API_RESOURCES_PREFIX.TYPEAHEAD} required { name: }`, (done: Function) =>
      request(application.getHttpServer())
        .post(`/${API_RESOURCES_PREFIX.TYPEAHEAD}`)
        .expect(400, done));

    it(`/POST ${API_RESOURCES_PREFIX.TYPEAHEAD} invalid param { name: "${wrongName}" }`, (done: Function) =>
      request(application.getHttpServer())
        .post(`/${API_RESOURCES_PREFIX.TYPEAHEAD}`)
        .send({ name: wrongName })
        .expect(400, done));
  });

  afterAll(async () => await application.close());
});
