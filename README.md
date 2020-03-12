# n0bbs

## How to use

### 1. edit environments in docker-compose.yml

- github oauth app: https://github.com/settings/applications/new
    - you need https server if you deploy to not localhost.
- slack incoming hook: https://api.slack.com/messaging/webhooks#posting_with_webhooks

```yaml
    environment:
      SECRET_KEY: "hogehoge"
      DEBUG: "true"
      ALLOWED_HOST: localhost
      SLACK_INCOMING_HOOK_URL: https://hooks.slack.com/services/***
      SOCIAL_AUTH_GITHUB_KEY: "***"
      SOCIAL_AUTH_GITHUB_SECRET: "***"
```

### 2. migrate to the database

```sh
make up
make migrate
make down
```

### 3. start server

```sh
make up
```

## How to contribute

- please vote to enhancement issues which you want.
- please issue pull requests after forking this repository.
    - i recommend for you to issue pull requests after discussing on issues.
