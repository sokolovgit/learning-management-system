
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=build-stage /app /app
EXPOSE 3000
CMD ["npm", "start"]
