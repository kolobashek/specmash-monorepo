FROM node:current-alpine

WORKDIR /app

COPY *yarn.lock package*.json ./
RUN yarn install

COPY . .

RUN yarn

EXPOSE 3000
CMD ["yarn", "dev", "--host", "0.0.0.0"]
