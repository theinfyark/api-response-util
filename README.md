# api-response-util

Tiny zero-dependency helpers for **consistent Express API JSON responses**.

> Note: `api-response-kit` is already taken on npm, so this package is published as **`api-response-util`**.

```bash
npm install api-response-util
```

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
