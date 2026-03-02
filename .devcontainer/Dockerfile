FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

USER node

RUN echo 'export PS1="\w # "' >> /home/node/.bashrc
