# Build context: repository root
FROM node:22.13.1-alpine AS build
WORKDIR /workspace/frontend

COPY frontend/package*.json ./
# npm install is intentional while package.json and package-lock.json are being aligned.
RUN npm install --no-audit --no-fund

COPY frontend/ ./
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine AS runtime

ENV PORT=10000 \
    API_UPSTREAM=backend:8080 \
    NGINX_ENVSUBST_FILTER="^(API_UPSTREAM|PORT)$"

COPY frontend/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /workspace/frontend/dist/frontend/browser /usr/share/nginx/html

EXPOSE 10000
