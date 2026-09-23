# Task Manager API

## Practical 9: In-Memory Caching and Query Optimization

This practical adds in-memory caching to `GET /tasks` using `node-cache`.

### Cache Configuration

The shared cache is initialized in `cache.js`:

```js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 });
module.exports = cache;
```

The `GET /tasks` route uses the cache key `all_tasks`:

- `MISS`: tasks are read from MongoDB and stored in the cache.
- `HIT`: tasks are returned directly from the in-memory cache.
- The cache expires automatically after 60 seconds.
- The cache is cleared after successful `POST`, `PUT`, and `DELETE` operations.

The endpoint returns these response headers for testing:

```text
X-Cache: HIT or MISS
X-Response-Time: server processing time in milliseconds
```

Postman's **Time** field can also be used to record the complete client-observed response time.

## Postman Measurements

Endpoint tested:

```text
GET http://localhost:5000/tasks
```

### Without Caching

Caching was temporarily disabled by commenting out the cache lookup and `cache.set()` call.

| Request | Cache Status | Server Response Time |
|---:|---|---:|
| 1 | MISS | 9.3828 ms |
| 2 | MISS | 2.0157 ms |
| 3 | MISS | 1.6297 ms |

### With Caching Enabled

The first request was a warm-up request that populated the cache. The following requests returned the cached result.

| Request | Cache Status | Server Response Time |
|---:|---|---:|
| 1 | MISS | 11.7458 ms |
| 2 | HIT | 0.8611 ms |
| 3 | HIT | 1.012 ms |

### Comparison

The cache-hit requests completed in approximately `0.86-1.01 ms`, while the uncached requests took approximately `1.63-9.38 ms` in the recorded test. The exact time can vary depending on MongoDB state, network conditions, and server load.

## Running the API

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm start
```

The API runs on port `5000` by default.
