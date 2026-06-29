# Mr.Bio — VPS Deployment

Single-VPS deployment of frontend + backend (microservices) behind Caddy with automatic HTTPS.

## Topology

```
Internet :443
    │
  Caddy (TLS, Let's Encrypt)
    ├── mrbionp.com         → frontend (nginx static)
    └── api.mrbionp.com     → gateway:3000
                                  ├── user-auth:3001
                                  ├── communication:3002
                                  ├── activity-log:3003
                                  └── product:3004
                                Redis · Kafka · (Mongo Atlas, external)
```

Only ports **80** and **443** are exposed publicly. All service-to-service traffic stays on the internal Docker network `mrbio`. Backend service ports (3000–3004) are container-internal only — they do NOT bind to host ports, so they can safely coexist with other apps already using 3000/3001 on the VPS.

## Prerequisites

- VPS with Docker + Docker Compose v2 installed
- DNS A records: `mrbionp.com`, `www.mrbionp.com`, `api.mrbionp.com` → VPS IP
- MongoDB Atlas cluster credentials
- Firewall: allow 22, 80, 443

## First-time bootstrap

```bash
# On the VPS
git clone https://github.com/<your-username>/MrBio.git
cd MrBio

# Backend env files (copy from examples and fill in)
cp Ecommerce-Frontend-Mr.Bio/.env.example Ecommerce-Frontend-Mr.Bio/.env
cp mr-bio-service-mr-bio-setup/.env.example mr-bio-service-mr-bio-setup/.env
cp mr-bio-service-mr-bio-setup/apps/gateway/.env.example       mr-bio-service-mr-bio-setup/apps/gateway/.env
cp mr-bio-service-mr-bio-setup/apps/user-auth/.env.example     mr-bio-service-mr-bio-setup/apps/user-auth/.env
cp mr-bio-service-mr-bio-setup/apps/communication/.env.example mr-bio-service-mr-bio-setup/apps/communication/.env
cp mr-bio-service-mr-bio-setup/apps/activity-log/.env.example  mr-bio-service-mr-bio-setup/apps/activity-log/.env
cp mr-bio-service-mr-bio-setup/apps/product/.env.example       mr-bio-service-mr-bio-setup/apps/product/.env

# Edit each .env to set real values (Mongo, Redis password, JWT secret, S3, etc.)
# In mr-bio-service-mr-bio-setup/apps/gateway/.env make sure:
#   USER_AUTH_SERVICE=http://user-auth:3001
#   COMMUNICATION_SERVICE=http://communication:3002
#   ACTIVITY_LOG_SERVICE=http://activity-log:3003

# Frontend already points to https://api.mrbionp.com/api/ via its .env

# Update Caddyfile email if needed
nano Caddyfile

# Build and launch
docker compose -f docker-compose.prod.yml up -d --build

# Watch logs
docker compose -f docker-compose.prod.yml logs -f
```

Caddy will request TLS certificates automatically on first start. DNS must already point at the VPS for issuance to succeed.

## Updates

```bash
cd MrBio
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Service URLs

- Frontend: https://mrbionp.com
- API gateway: https://api.mrbionp.com (matches the frontend's `VITE_BASE_URL`)
- Health: https://api.mrbionp.com/user-auth/health

## Notes

- Frontend `.env` is baked into the build. Rebuild the frontend container after changing it.
- Product service uploads land in the `product_assets` Docker volume.
- Redis password and all secrets come from `mr-bio-service-mr-bio-setup/.env`.
- The frontend repo's `.env` currently contains live values; rotate the merchant ID before making the GitHub repo public.
