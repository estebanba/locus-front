# syntax=docker/dockerfile:1.10
# Vite SPA image: static build served by unprivileged nginx (port 8080).
# Template from the infra repo (skills/coolify-app). Adapted for locus-front (portfolio, www.estebanbasili.com).
# Built in GitHub Actions for linux/arm64, pushed to GHCR, deployed by Coolify.
#
# Local build:
#   docker build --secret id=npm_token,env=NODE_AUTH_TOKEN \
#     --build-arg VITE_API_BASE_URL=https://api.locus.estebanbasili.com/api -t app .
#
# VITE_API_BASE_URL is baked into the bundle at build time (public, not a secret).
# NODE_ENV=production at build time (some configs, e.g. vite-plugin-pwa, only activate then); dev deps still installed.

ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app
# Every VITE_* variable the app reads (baked in at build time, public)
ARG VITE_API_BASE_URL=https://api.locus.estebanbasili.com/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    NODE_ENV=production
COPY package.json package-lock.json .npmrc* ./
RUN --mount=type=secret,id=npm_token,env=NODE_AUTH_TOKEN \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx-security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
# busybox wget is available in alpine; Coolify's health check also uses it
HEALTHCHECK --interval=60s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
