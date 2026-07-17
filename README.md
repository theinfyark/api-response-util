# api-response-util

Tiny zero-dependency helpers for **consistent Express API JSON responses**.

> Note: `api-response-kit` is already taken on npm, so this package is published as **`api-response-util`**.

```bash
npm install api-response-util
```

## Quick Start

## Instead of

```js
res.json(data);
res.status(400).json({ message: 'Invalid User' });
res.status(404).json({ message: 'Not Found' });
```

## Do

```js
import { success, error, created, notFound } from 'api-response-util';

success(res, data);
error(res, 'Invalid User');
created(res, user);
notFound(res);
```

## Response shape

**Success**

```json
{
  "success": true,
  "data": {}
}
```

**Error**

```json
{
  "success": false,
  "error": {
    "message": "Invalid User"
  }
}
```

## Express example

```js
import express from 'express';
import { success, error, created, notFound } from 'api-response-util';

const app = express();
app.use(express.json());

app.get('/users/:id', (req, res) => {
  const user = null; // pretend lookup
  if (!user) return notFound(res, 'User not found');
  return success(res, user);
});

app.post('/users', (req, res) => {
  if (!req.body?.email) return error(res, 'Invalid User');
  return created(res, { id: 1, ...req.body });
});

app.listen(3000);
```

## API

| Helper                                   | Status      | Purpose           |
| ---------------------------------------- | ----------- | ----------------- |
| `success(res, data, options?)`           | 200         | OK                |
| `created(res, data, options?)`           | 201         | Created           |
| `error(res, message, status?, details?)` | 400 default | Error             |
| `notFound(res, message?, details?)`      | 404         | Not found         |
| `unauthorized(res, message?, details?)`  | 401         | Auth required     |
| `forbidden(res, message?, details?)`     | 403         | Forbidden         |
| `conflict(res, message?, details?)`      | 409         | Conflict          |
| `fail(res, message?, details?)`          | 500         | Server error      |
| `noContent(res)`                         | 204         | Empty body        |
| `paginated(res, data, meta)`             | 200         | Lists + page meta |

### Options for `success` / `created`

```js
success(res, items, {
  message: 'Fetched',
  meta: { count: items.length },
});
```

### Pagination

```js
paginated(res, users, { page: 1, limit: 20, total: 100 });
```

```json
{
  "success": true,
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 100, "pages": 5 }
}
```

## Requirements

- Node.js 18+
- Works with Express (or any `res.status().json()` response object)
- Zero runtime dependencies

## License

MIT

## Introduction

**api-response-util** helps you ship reliable Node.js / TypeScript applications with a small, focused API.

## Why this package exists

Popular stacks need small, trustworthy utilities with excellent DX. **api-response-util** exists to solve one problem well: clear APIs, strong typing, minimal dependencies, and production-ready defaults — without the overhead of larger frameworks.

## Installation

```bash
npm install api-response-util
# or
pnpm add api-response-util
yarn add api-response-util
```

Requires Node.js 18+.

## API Reference

See the exports from `api-response-util` and the inline TypeScript types for the full surface area. Primary entry points are documented in **Quick Start** and **Examples** above.

## Examples

Minimal usage is shown in **Quick Start**. Prefer copying those snippets first, then expand into your app’s error handling and configuration patterns.

## Advanced Examples

- Combine with environment validation, logging, and health checks in production services
- Prefer dependency injection / custom `fetch` / client injection in tests
- Keep configuration explicit; avoid hidden global state

## Framework Integration

Works with Express, Fastify, Hono, NestJS, and plain Node HTTP servers. Import ESM (or CJS where published) and call the documented APIs from route handlers, middleware, or background jobs.

## TypeScript Usage

```ts
import { success, error, created, notFound } from 'api-response-util';
```

Types ship with the package (`types` / `exports.types`). Enable `strict` in your `tsconfig` for the best DX.

## Error Handling

- Fail fast with typed / named errors where provided
- Never swallow errors silently in production paths
- Prefer returning structured error payloads in HTTP layers
- Surface actionable messages (what failed + how to fix)

## Performance

- Minimal runtime work on the hot path
- Avoid unnecessary allocations and dependencies
- Tree-shakeable ESM entry points
- Prefer streaming / lazy work when dealing with large payloads

## Best Practices

- Pin major versions with SemVer ranges you trust
- Validate configuration at process startup
- Add health checks and observability around I/O
- Write tests for failure modes (timeouts, bad input, missing credentials)

## FAQ

**Does it work with ESM and CommonJS?**  
Yes where the package publishes dual exports. Prefer ESM for new projects.

**Is it production-ready?**  
Yes — tests, types, and SemVer releases are part of the maintenance model.

**How do I report a bug?**  
Open a GitHub issue using the bug template.

## Migration Guide

### From 0.x / early drafts

This package follows SemVer. Breaking changes land in major releases and are called out in `CHANGELOG.md`.

### Upgrading patch/minor

Patch and minor releases are backward compatible. Run your test suite after upgrading.

## Troubleshooting

| Symptom                   | Likely cause                         | Fix                                  |
| ------------------------- | ------------------------------------ | ------------------------------------ |
| `ERR_MODULE_NOT_FOUND`    | Wrong Node version / bad import path | Use Node 18+ and package `exports`   |
| Types not resolving       | Old moduleResolution                 | Use `bundler` or `node16`+           |
| Auth / network failures   | Missing env or blocked egress        | Check credentials and firewall       |
| Unexpected runtime errors | Invalid input                        | Validate options; read error message |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). PRs with tests and docs are welcome.
