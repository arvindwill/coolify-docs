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
      content: '@coolifyio'
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
# Service Templates

Service templates are predefined normal [docker-compose](https://docs.docker.com/compose/compose-file/compose-file-v3/) files + a bit of magic.

## The bit of Magic

To be able to predefine values, like usernames, passwords, fqdns, predefined values for bind (file) mounts etc, the docker-compose files are extended with a few keywords. 

> More magic coming soon 🪄

--- 

In the [environment](https://docs.docker.com/compose/compose-file/compose-file-v3/#environment) option, you can do the following. 

Let's use `APPWRITE` as an example with a generate UUID of `vgsco4o` and with a [wildcard](/servers.md#wildcard-domain) domain of `http://example.com`.

--- 

### FQDN

This will [generate](/servers.md#wildcard-domain) a FQDN for appwrite service.

```yaml
services:
    appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/
        - SERVICE_FQDN_APPWRITE 
```

If you use the same variable on another service, it will generate the same FQDN for you. 

```yaml
# This does not make sense, just here to show you how it works.
services:
    appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/
        - SERVICE_FQDN_APPWRITE 
    not-appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/
        - SERVICE_FQDN_APPWRITE
```

You sometimes need the same domain, but with different **paths**.

```yaml
# This make sense, not like the previous.
services:
    appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/
        - SERVICE_FQDN_APPWRITE
    not-appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/v1/realtime
        - SERVICE_FQDN_APPWRITE=/v1/realtime 
    definitely-not-appwrite:
      environment:
        # As SERVICE_FQDN_API is not the same as SERVICE_FQDN_APPWRITE
        # Coolify will generate a new FQDN 
        # http://definitely-not-appwrite-vgsco4o.example.com/api
        - SERVICE_FQDN_API=/api
```

You can reuse this generated FQDN anywhere.

```yaml
services:
    appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/
        - SERVICE_FQDN_APPWRITE 
        - _APP_URL=$SERVICE_FQDN_APPWRITE # _APP_URL will have the FQDN because SERVICE_FQDN_APPWRITE is just a simple environment variable
```

You sometimes need the same domain, but with different **ports**. This will tell the proxy which port to proxy to which domain.
In the example, we combine paths and ports.

```yaml
services:
    appwrite:
      environment:
        # http://appwrite-vgsco4o.example.com/ will be proxied to port 3000
        - SERVICE_FQDN_APPWRITE_3000
        # http://api-vgsco4o.example.com/api will be proxied to port 2000
        - SERVICE_FQDN_API_2000=/api
```

This could be used as a value as well. No default value allowed.

```yaml
services:
    appwrite:
      environment:
        # http://api-vgsco4o.example.com/api defined here
        - SERVICE_FQDN_API_2000=/api
        # http://appwrite-vgsco4o.example.com/ will be proxied to port 3000
        - APPWRITE_URL=$SERVICE_FQDN_APPWRITE_3000
        # http://api-vgsco4o.example.com/api will be proxied to port 2000
        - APPWRITE_API_URL=$SERVICE_FQDN_API_2000
```
---
### URL

This will [generate](/servers.md#wildcard-domain) an URL based on the FQDN you have defined.


```yaml
services:
    appwrite:
      environment:
        # appwrite-vgsco4o.example.com
        - SERVICE_URL_APPWRITE 
```

--- 

### Username

Example: `$SERVICE_USER_APPWRITE`

Generator: `Str::random(16)`

```yaml
services:
    appwrite:
      environment:
        # qwhraJlpdkyKYSQ1
        - APPWRITE_USERNAME=$SERVICE_USER_APPWRITE 
```

--- 

### Password

Example: `$SERVICE_PASSWORD_APPWRITE`

Generator: `Str::password(symbols: false)`
 
```yaml
services:
    appwrite:
      environment:
        # m5XOD0uY4k1hXgISYoJyLdPHG7oAbNYw 
        - APPWRITE_PASSWORD=$SERVICE_PASSWORD_APPWRITE
```

You can also generate 64 bit long password.

Example: `$SERVICE_PASSWORD_64_APPWRITE`

Generator: `Str::password(length: 64, symbols: false)`

```yaml
services:
    appwrite:
      environment:
        # J0QT0Cqr2ArmIT4RgTwK5F5lcXShgnJ53XTiHjqBbPntWVVG8DRHKnrsIjXBZJ8e 
        - APPWRITE_PASSWORD=$SERVICE_PASSWORD_64_APPWRITE
```

### Storage
You can predefine storage normally in your compose file, but there are a few extra options that you can set to tell Coolify what to do with the storage.

Let's see an example:

```yaml
# Predefine directories with host binding
services:
  filebrowser:
    image: filebrowser/filebrowser:latest
    environment:
      - SERVICE_FQDN_FILEBROWSER
    volumes:
      - type: bind
        source: ./srv
        target: /srv
        is_directory: true # This will tell Coolify to create the directory (this is not avaiable in a normal docker-compose)
      - ./database.db:/database.db 
      - ./filebrowser.json:/.filebrowser.json
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 2s
      timeout: 10s
      retries: 15
```


## Metadata

You need to add extra metadata to the top of the `docker-compose` file, like:
- documentation link
- a slogan
- additional tags (for better searching)

Example:
```
# documentation: https://docs.n8n.io/hosting/
# slogan: n8n is an extendable workflow automation tool which enables you to connect anything to everything via its open, fair-code model.
# tags: n8n,workflow,automation,open,source,low,code

... rest of the compose file ...

```
## Add a new service
Official templates stored [here](https://github.com/coollabsio/coolify/blob/main/templates/compose). They are just normal docker-compose files with a bit of magic.

To add a new service, your can easily test your templates with `Docker Compose` deployments inside Coolify. It uses the same process to parse, generate and deploy as the one-click services.

If you are done with tests and everything works, open a [PR](https://github.com/coollabsio/coolify/compare), that have the new `<service>.yaml` compose file under `/templates/compose`.


::: tip
Coolify will use a [parsed version](https://github.com/coollabsio/coolify/blob/main/templates/service-templates.json).
:::

