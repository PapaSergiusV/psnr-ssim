FROM node:14.4.0

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install

CMD [ "npm", "start" ]
