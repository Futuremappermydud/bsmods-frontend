# Alpine Node Image
FROM node:20-alpine
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/app

# Install prod dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Repo Metadata
ARG GIT_REPO
ARG GIT_VERSION
LABEL org.opencontainers.image.source=${GIT_REPO}
ENV GIT_VERSION=${GIT_VERSION}

# Start Website
CMD ["yarn", "docker"]