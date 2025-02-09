---
head:
  - - meta
    - name: description
      content: Coolify Documentation
  - - meta
    - name: keywords
      content: coolify self-hosting docker kubernetes vercel netlify heroku render digitalocean aws gcp azure
  - - meta
    - name: twitter:card
      content: summary_large_image
  - - meta
    - name: twitter:site
      content: "@coolifyio"
  - - meta
    - name: twitter:title
      content: Coolify Documentation
  - - meta
    - name: twitter:description
      content: Self-hosting with superpowers.
  - - meta
    - name: twitter:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:url
      content: https://coolify.io
  - - meta
    - property: og:title
      content: Coolify
  - - meta
    - property: og:description
      content: Self-hosting with superpowers.
  - - meta
    - property: og:site_name
      content: Coolify
  - - meta
    - property: og:image
      content: https://cdn.coollabs.io/assets/coolify/og-image-docs.png
---

# Docker Compose

If you are using `Docker Compose` based deployments, you need to understand how Docker Compose works with Coolify.

In all cases the Docker Compose (`docker-compose.y[a]ml`) file is the single source of truth.

## Defining environment variables

You have the following compose file:

```yaml
version: '3.8'

services:
  db:
    image: adminer
    environment:
      TEST: ${TEST}
```

And you define `TEST` and `ANOTHERTEST` environment variables inside Coolify, only `TEST` will be used, as Coolify cannot determine where to add `ANOTHERTEST` environment variable.

So if you want to use `ANOTHERTEST` environment variable, you need to add it to the compose file.

```yaml
version: '3.8'

services:
  db:
    image: adminer
    environment:
      TEST: ${TEST}
      ANOTHERTEST: ${ANOTHERTEST}
```

## Raw Docker Compose Deployment
You can set with docker compose build pack to deploy your compose file directly without Coolify's magic. It is called `Raw Compose Deployment`.

:::tip
This is for advanced users. If you are not familiar with Docker Compose, we do not recommend this method.
:::

### What to set?
To be able to use Coolify's monitoring feature and optionally Traefik, you need to set the following labels on your application.

```yaml
  labels:
      - traefik.enable=true
      - 'traefik.http.routers.zoc0g0g-0-http.rule=Host(`coolify.io`) && PathPrefix(`/`)'
      - traefik.http.routers.zoc0g0g-0-http.entryPoints=http
      - traefik.http.routers.zoc0g0g-0-http.middlewares=gzip
      - coolify.managed=true
      - coolify.applicationId=5
      - coolify.type=application
```

- `zoc0g0g-0-http` is a random string. You can set whatever you want.
- Set the `Host` rule to your domain / path necessary.
- `coolify` is the prefix for Coolify's labels.
- `coolify.applicationId` is your application id. You can find it on your application's General page at the `Docker Compose Content` input box (bottom page).


## Connect to Predefined Networks
By default, each compose stack is deployed to a separate network, with the name of your resource uuid. This will allow to each service in your stack to communicate with each other.

But in some cases, you would like to communicate with other resources in your account. For example, you would like to connect your application to a database, which is deployed in another stack.

To do this you need to enable `Connect to Predefined Network` option on your `Service Stack` page, but this will make the internal Docker DNS not work as expected.

Here is an example. You have a stack with a `postgres` database and a `laravel` application. Coolify will rename your `postgres` stack to `postgres-<uuid>` and your `laravel` stack to `laravel-<uuid>` to prevent name collisions.

If you set `Connect to Predefined Network` option on your `laravel` stack, your `laravel` application will be able to connect to your `postgres` database, but you need to use the `postgres-<uuid>` as your `DB_HOST` environment variable.