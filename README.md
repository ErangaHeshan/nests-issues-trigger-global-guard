## Description

NestJS backend for reproducing the issue where a global guard is not executed when a GraphQL request hit the server. 

## Installation

```bash
$ npm install
```

## Running the app

1. Run the Postgres database in the background
```bash
docker compose -f src/docker-compose-only-db.yml up - d
```

2. Run the application
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## GraphQL Queries

### UserDetails
```graphql
query UserDetails {
  userDetails {
    id
    right
  }
}
```

### SingleUserDetail
```graphql
query SingleUserDetail {
  firstUserDetail {
    id
    right
  }
}
```

### Numbers
```graphql
query GenerateNumbers {
  generateInt
}
```

## Test cURL Requests

### 1. A user with proper access

  ```bash
  curl --location 'http://localhost:3000/graphql' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEiLCJkYXRhYmFzZSI6InRlc3QiLCJpYXQiOjE2OTY1MTk1MzksImV4cCI6MTY5NjUyNjczOX0.DbLxnjc0gmmatmZdQt-JwggjFaq_SsXDJ8N1z_0W-90' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query UserDetails {\n  userDetails {\n    id\n    right\n  }\n}","variables":{}}'
  ```

  #### Expected Response:

  ```json
  {
    "data": {
      "userDetails": [
        {
          "id": 1,
          "right": "subscription"
        },
        {
          "id": 2,
          "right": "read"
        }
      ]
    }
  }
  ```

  #### Bearer token decoded JSON: 

  ```json
  {
    "id": "1",
    "database": "test",
    "iat": 1696519539,
    "exp": 1696526739
  }
  ```

### 2. A user without proper access

  ```bash
  curl --location 'http://localhost:3000/graphql' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjIiLCJkYXRhYmFzZSI6InRlc3QiLCJpYXQiOjE2OTY1MTk1MzksImV4cCI6MTY5NjUyNjczOX0.xIELN2FClbcW2mnfGRQ50ymY1AxU9uyB2K3t6LDfHPU' \
  --header 'Content-Type: application/json' \
  --data '{"query":"query UserDetails {\n  userDetails {\n    id\n    right\n  }\n}","variables":{}}'
  ```

  #### Expected Response:

  ```json
  {
    "errors": [
      {
        "message": "Forbidden resource",
        "locations": [
          {
            "line": 2,
            "column": 3
          }
        ],
        "path": [
          "userDetails"
        ],
        "extensions": {
          "code": "FORBIDDEN",
          "stacktrace": [
            "ForbiddenException: Forbidden resource",
            "    at canActivateFn (/NestJS/issues/trigger-global-guard/node_modules/@nestjs/core/helpers/external-context-creator.js:157:23)",
            "    at processTicksAndRejections (node:internal/process/task_queues:96:5)",
            "    at target (/NestJS/issues/trigger-global-guard/node_modules/@nestjs/core/helpers/external-context-creator.js:73:31)",
            "    at /NestJS/issues/trigger-global-guard/node_modules/@nestjs/core/helpers/external-proxy.js:9:24"
          ],
          "originalError": {
            "message": "Forbidden resource",
            "error": "Forbidden",
            "statusCode": 403
          }
        }
      }
    ],
    "data": null
  }
  ```

  #### Bearer token decoded JSON: 

  ```json
  {
    "id": "2",
    "database": "test",
    "iat": 1696519539,
    "exp": 1696526739
  }
  ```

