# use node.js image to build the application
FROM node:alpine AS base

# set the working directory in container
# all subsequent commands will be run in this directory
WORKDIR /usr/src/app

# install dev/production dependencies into temp directories
# continue from 'base' as 'install' to manage dependencies separately
FROM base AS install

# create a temporary directory for development dependencies
RUN mkdir -p /temp/dev

# copy the package files to install dependencies
COPY package.json package-lock.json /temp/dev/

# change to the directory and install all dependencies with a frozen lockfile (ensures consistent versions)
RUN cd /temp/dev && npm install --frozen-lockfile

# same procedure for production dependencies
RUN mkdir -p /temp/prod
COPY package.json package-lock.json /temp/prod/

# install only production dependencies to optimize the final image size
RUN cd /temp/prod && npm install --frozen-lockfile --production

# prepare the final build, which will contain only the necessary files FROM base AS release
FROM base AS release

# copy all the development dependencies into the container
COPY --from=install /temp/dev/node_modules node_modules

# copy the rest of the application files into the working directory
COPY . .

# expose the port on which the spring boot app is running (4200 is default for angular)
EXPOSE 4200

# run the application and make it accessible on all network interfaces
ENTRYPOINT [ "npm", "run", "start", "--", "--host", "0.0.0.0" ]