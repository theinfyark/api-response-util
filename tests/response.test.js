import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  success,
  created,
  error,
  notFound,
  unauthorized,
  forbidden,
  conflict,
  fail,
  noContent,
  paginated,
} from '../src/index.js';

function mockRes() {
  /** @type {{ statusCode: number | null, body: unknown, status: Function, json: Function, sendStatus?: Function, send?: Function }} */
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
    sendStatus(code) {
      this.statusCode = code;
      this.body = undefined;
      return this;
    },
    send(body) {
      this.body = body;
      return this;
    },
  };
  return res;
}

describe('api-response-util', () => {
  it('success(res, data)', () => {
    const res = mockRes();
    success(res, { id: 1 });
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { success: true, data: { id: 1 } });
  });

  it('created(res, user)', () => {
    const res = mockRes();
    created(res, { name: 'Ann' });
    assert.equal(res.statusCode, 201);
    assert.deepEqual(res.body, { success: true, data: { name: 'Ann' } });
  });

  it('error(res, "Invalid User")', () => {
    const res = mockRes();
    error(res, 'Invalid User');
    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, {
      success: false,
      error: { message: 'Invalid User' },
    });
  });

  it('notFound(res)', () => {
    const res = mockRes();
    notFound(res);
    assert.equal(res.statusCode, 404);
    assert.deepEqual(res.body, {
      success: false,
      error: { message: 'Not Found' },
    });
  });

  it('supports optional message/meta and status helpers', () => {
    const res = mockRes();
    success(res, [], { message: 'ok', meta: { count: 0 } });
    assert.deepEqual(res.body, {
      success: true,
      data: [],
      message: 'ok',
      meta: { count: 0 },
    });

    unauthorized(mockRes(), 'No token');
    forbidden(mockRes());
    conflict(mockRes(), 'Exists');
    fail(mockRes());

    const p = mockRes();
    paginated(p, [1, 2], { page: 1, limit: 2, total: 5 });
    assert.equal(p.statusCode, 200);
    assert.deepEqual(/** @type {any} */ (p.body).meta, {
      page: 1,
      limit: 2,
      total: 5,
      pages: 3,
    });
  });

  it('noContent(res)', () => {
    const res = mockRes();
    noContent(res);
    assert.equal(res.statusCode, 204);
  });
});
