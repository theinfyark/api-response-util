export interface ResponseLike {
  status(code: number): ResponseLike & {
    json(body: unknown): unknown;
    send?(body?: unknown): unknown;
  };
  json(body: unknown): unknown;
  sendStatus?(code: number): unknown;
  send?(body?: unknown): unknown;
}

export interface SuccessOptions {
  message?: string;
  meta?: unknown;
  status?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  message?: string;
}

export function success(
  res: ResponseLike,
  data?: unknown,
  options?: SuccessOptions,
): unknown;

export function created(
  res: ResponseLike,
  data?: unknown,
  options?: Omit<SuccessOptions, "status">,
): unknown;

export function error(
  res: ResponseLike,
  message: string,
  status?: number,
  details?: unknown,
): unknown;

export function notFound(
  res: ResponseLike,
  message?: string,
  details?: unknown,
): unknown;

export function unauthorized(
  res: ResponseLike,
  message?: string,
  details?: unknown,
): unknown;

export function forbidden(
  res: ResponseLike,
  message?: string,
  details?: unknown,
): unknown;

export function conflict(
  res: ResponseLike,
  message?: string,
  details?: unknown,
): unknown;

export function fail(
  res: ResponseLike,
  message?: string,
  details?: unknown,
): unknown;

export function noContent(res: ResponseLike): unknown;

export function paginated(
  res: ResponseLike,
  data: unknown[],
  meta: PaginationMeta,
): unknown;
