/**
 * @typedef {object} ResponseLike
 * @property {(code: number) => ResponseLike} status
 * @property {(body: unknown) => unknown} json
 */

/**
 * @param {ResponseLike} res
 * @param {number} status
 * @param {Record<string, unknown>} body
 */
function send(res, status, body) {
  return res.status(status).json(body);
}

/**
 * 200 OK success response.
 *
 * @param {ResponseLike} res
 * @param {unknown} [data=null]
 * @param {{ message?: string, meta?: unknown, status?: number }} [options]
 *
 * @example
 * success(res, { id: 1 });
 * // { success: true, data: { id: 1 } }
 */
export function success(res, data = null, options = {}) {
  const status = options.status ?? 200;
  /** @type {Record<string, unknown>} */
  const body = {
    success: true,
    data,
  };
  if (options.message !== undefined) body.message = options.message;
  if (options.meta !== undefined) body.meta = options.meta;
  return send(res, status, body);
}

/**
 * 201 Created response.
 *
 * @param {ResponseLike} res
 * @param {unknown} [data=null]
 * @param {{ message?: string, meta?: unknown }} [options]
 *
 * @example
 * created(res, user);
 */
export function created(res, data = null, options = {}) {
  return success(res, data, { ...options, status: 201 });
}

/**
 * Error response.
 *
 * @param {ResponseLike} res
 * @param {string} message
 * @param {number} [status=400]
 * @param {unknown} [details]
 *
 * @example
 * error(res, "Invalid User");
 * error(res, "Unauthorized", 401);
 */
export function error(res, message, status = 400, details) {
  /** @type {Record<string, unknown>} */
  const err = { message };
  if (details !== undefined) err.details = details;

  return send(res, status, {
    success: false,
    error: err,
  });
}

/**
 * 404 Not Found response.
 *
 * @param {ResponseLike} res
 * @param {string} [message="Not Found"]
 * @param {unknown} [details]
 *
 * @example
 * notFound(res);
 * notFound(res, "User not found");
 */
export function notFound(res, message = 'Not Found', details) {
  return error(res, message, 404, details);
}

/**
 * 401 Unauthorized.
 *
 * @param {ResponseLike} res
 * @param {string} [message="Unauthorized"]
 * @param {unknown} [details]
 */
export function unauthorized(res, message = 'Unauthorized', details) {
  return error(res, message, 401, details);
}

/**
 * 403 Forbidden.
 *
 * @param {ResponseLike} res
 * @param {string} [message="Forbidden"]
 * @param {unknown} [details]
 */
export function forbidden(res, message = 'Forbidden', details) {
  return error(res, message, 403, details);
}

/**
 * 409 Conflict.
 *
 * @param {ResponseLike} res
 * @param {string} [message="Conflict"]
 * @param {unknown} [details]
 */
export function conflict(res, message = 'Conflict', details) {
  return error(res, message, 409, details);
}

/**
 * 500 Internal Server Error.
 *
 * @param {ResponseLike} res
 * @param {string} [message="Internal Server Error"]
 * @param {unknown} [details]
 */
export function fail(res, message = 'Internal Server Error', details) {
  return error(res, message, 500, details);
}

/**
 * 204 No Content (empty body).
 *
 * @param {ResponseLike & { sendStatus?: (code: number) => unknown, send?: (body?: unknown) => unknown }} res
 */
export function noContent(res) {
  if (typeof res.sendStatus === 'function') return res.sendStatus(204);
  return res.status(204).send();
}

/**
 * Paginated success response.
 *
 * @param {ResponseLike} res
 * @param {unknown[]} data
 * @param {{ page: number, limit: number, total: number, message?: string }} meta
 */
export function paginated(res, data, meta) {
  const pages = meta.limit > 0 ? Math.ceil(meta.total / meta.limit) : 0;
  return success(res, data, {
    message: meta.message,
    meta: {
      page: meta.page,
      limit: meta.limit,
      total: meta.total,
      pages,
    },
  });
}
