import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, test } from 'node:test';
import express from 'express';
import cookieParser from 'cookie-parser';
import usersRouter from '../src/routes/usersRoutes.js';
import feedbacksRouter from '../src/routes/feedbacksRoutes.js';
import { errorHandler } from '../src/middleware/errorHandler.js';
import { Feedback } from '../src/models/feedback.js';
import { User } from '../src/models/user.js';
import { Session } from '../src/models/session.js';

let server;
let baseUrl;

before(async () => {
  const app = express();
  app.use(cookieParser());
  app.use('/api/users', usersRouter);
  app.use('/api/feedbacks', feedbacksRouter);
  app.use(errorHandler);
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(
  () =>
    new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
);

const request = async (path, headers) => {
  const response = await fetch(`${baseUrl}${path}`, { headers });
  return { status: response.status, body: await response.json() };
};

test('GET /users/me rejects requests without session cookies', async () => {
  const result = await request('/api/users/me');
  assert.equal(result.status, 401);
  assert.equal(result.body.status, 401);
});

test('GET /users/me returns the authenticated user without the password', async (t) => {
  const user = new User({
    name: 'Test User',
    email: 'test@example.com',
    password: 'secret',
  });
  t.mock.method(Session, 'findOne', async () => ({
    userId: user._id,
    accessTokenValidUntil: new Date(Date.now() + 60_000),
  }));
  t.mock.method(User, 'findById', async () => user);
  const result = await request('/api/users/me', {
    Cookie: 'sessionId=test; accessToken=test',
  });
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, { data: JSON.parse(JSON.stringify(user)) });
  assert.equal(Object.hasOwn(result.body.data, 'password'), false);
});

for (const [name, session] of [
  ['missing', null],
  ['expired', { accessTokenValidUntil: new Date(0) }],
]) {
  test(`GET /users/me rejects a ${name} session`, async (t) => {
    t.mock.method(Session, 'findOne', async () => session);
    const result = await request('/api/users/me', {
      Cookie: 'sessionId=test; accessToken=test',
    });
    assert.equal(result.status, 401);
  });
}

const stubFeedbacks = (t, items, totalItems) => {
  const query = Feedback.find();
  const exec = t.mock.method(query, 'exec', async () => items);
  t.mock.method(Feedback, 'find', () => query);
  t.mock.method(Feedback, 'countDocuments', async () => totalItems);
  return { query, exec };
};

test('GET /feedbacks applies default pagination, stable newest-first ordering and population', async (t) => {
  const items = [
    { _id: 'feedback', locationId: { _id: 'location', name: 'Lake' } },
  ];
  const { query } = stubFeedbacks(t, items, 7);
  const result = await request('/api/feedbacks');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    page: 1,
    limit: 6,
    totalItems: 7,
    totalPages: 2,
    items,
  });
  assert.deepEqual(query.getOptions().sort, { createdAt: -1, _id: -1 });
  assert.equal(query.getOptions().skip, 0);
  assert.equal(query.getOptions().limit, 6);
  assert.equal(query._mongooseOptions.populate.locationId.select, 'name');
});

test('GET /feedbacks converts query strings and selects the requested page', async (t) => {
  const { query } = stubFeedbacks(t, [], 51);
  const result = await request('/api/feedbacks?page=2&limit=50');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    page: 2,
    limit: 50,
    totalItems: 51,
    totalPages: 2,
    items: [],
  });
  assert.equal(query.getOptions().skip, 50);
  assert.equal(query.getOptions().limit, 50);
});

test('GET /feedbacks returns an empty collection', async (t) => {
  stubFeedbacks(t, [], 0);
  const result = await request('/api/feedbacks');
  assert.equal(result.status, 200);
  assert.deepEqual(result.body, {
    page: 1,
    limit: 6,
    totalItems: 0,
    totalPages: 0,
    items: [],
  });
});

for (const query of [
  'page=0',
  'page=-1',
  'page=1.5',
  'page=abc',
  'limit=0',
  'limit=-1',
  'limit=51',
  'limit=1.5',
  'limit=abc',
  'limit=',
  'limit=1&limit=2',
  'page=1&page=2',
  'unknown=1',
]) {
  test(`GET /feedbacks rejects ${query} before querying the database`, async (t) => {
    const find = t.mock.method(Feedback, 'find', () =>
      assert.fail('Unexpected database query'),
    );
    const result = await request(`/api/feedbacks?${query}`);
    assert.equal(result.status, 400);
    assert.equal(find.mock.callCount(), 0);
  });
}

for (const operation of ['find', 'countDocuments']) {
  test(`GET /feedbacks forwards ${operation} errors to the error handler`, async (t) => {
    const { exec } = stubFeedbacks(t, [], 0);
    const fail = async () => {
      throw new Error('Database failure');
    };
    if (operation === 'find') exec.mock.mockImplementation(fail);
    else t.mock.method(Feedback, 'countDocuments', fail);
    const result = await request('/api/feedbacks');
    assert.equal(result.status, 500);
    assert.deepEqual(result.body, {
      status: 500,
      message: 'Internal server error',
    });
  });
}
