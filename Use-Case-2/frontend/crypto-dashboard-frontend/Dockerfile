# --- Base Stage ---
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# --- Install-Stage ---
FROM base AS install
RUN mkdir -p /temp/dev

# Copy package files and install dependencies
COPY package.json package-lock.json /temp/dev/
RUN cd /temp/dev && npm install --frozen-lockfile

# Copy the remaining source code into the working directory
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Expose the standard development port (4200)
EXPOSE 4200

# Start Angular in dev mode (without --prod)
ENTRYPOINT [ "npm", "run", "start", "--", "--host", "0.0.0.0" ]
