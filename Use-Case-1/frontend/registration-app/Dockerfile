# use node.js image to build the application
FROM node:18 AS base

# set the working directory in container
# all subsequent commands will be run in this directory
WORKDIR /usr/src/app

# Install production dependencies
COPY package.json package-lock.json ./
#RUN npm install --omit=dev
RUN npm install

# Copy application code
COPY . .

# Release ports
EXPOSE 4200

# Start the application
ENTRYPOINT ["npm", "run", "start", "--", "--host", "0.0.0.0"]