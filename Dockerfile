# Dockerfile — builds the session generator (web/) only.
#
# Used by Fly.io, Render Docker mode, Koyeb Dockerfile mode, etc.
# Bot-Hosting panel and PM2 deploys DON'T use this file — they
# git-clone + npm install via panel/index-node.js.
#
# Image size: ~80 MB (node:20-alpine + express + baileys lazy-loaded)

FROM node:20-alpine

# git is needed only because npm install can pull deps from git refs
RUN apk add --no-cache git

WORKDIR /app

# Install deps first (better Docker layer caching when only source changes)
COPY package.json package-lock.json* ./
RUN npm install --omit=optional --no-audit --no-fund --loglevel=error

# Copy only what the session site needs
COPY web ./web

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["node", "web/server.js"]
