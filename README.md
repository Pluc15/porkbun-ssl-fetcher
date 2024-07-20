# Porkbun SSL Fetcher

A small docker container you can use to download your SSL certificate and put them where you need them.

# Usage

## Docker Compose

```yaml
services:
  nginx:
    restart: unless-stopped
    image: nginx:latest
    volumes:
      - ssl-certificates:/certificates
    ports:
      - 80:80
      - 443:443

  porkbun-ssl-fetcher:
    restart: unless-stopped
    image: porkbun-ssl-fetcher
    environment:
      DOMAIN: ${DOMAIN}
      PORKBUN_API_KEY: ${PORKBUN_API_KEY}
      PORKBUN_SECRET_KEY: ${PORKBUN_SECRET_KEY}
    volumes:
      - ssl-certificates:/certificates
```

## Nginx Config

```
ssl_certificate /certificates/DOMAIN.chain.cert.pem;
ssl_certificate_key /certificates/DOMAIN.private.key.pem;
ssl_trusted_certificate /certificates/DOMAIN.intermediate.cert.pem;
```