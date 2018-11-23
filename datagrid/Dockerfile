FROM node:latest as builder

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# add environment variables
ARG REACT_APP_KINTO_USER
ARG REACT_APP_KINTO_PASSWORD
ENV REACT_APP_KINTO_USER $REACT_APP_KINTO_USER
ENV REACT_APP_KINTO_PASSWORD $REACT_APP_KINTO_PASSWORD

# install and cache app dependencies
ADD package.json /usr/src/app/package.json
RUN npm install --silent
RUN npm install pushstate-server -g --silent

# add app
ADD . /usr/src/app

# build react app
RUN npm run build

# start app
CMD ["pushstate-server", "build"]
