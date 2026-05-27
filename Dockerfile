# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: build
#   Installs dependencies and produces a static build in /app/dist
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first so Docker caches the npm install layer
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy source and build
COPY . .
RUN npm run build


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: serve
#   Lightweight nginx image to serve the static build
#   Final image is ~25 MB vs ~350 MB with Node.
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config: enable gzip, handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# nginx runs in the foreground
CMD ["nginx", "-g", "daemon off;"]
