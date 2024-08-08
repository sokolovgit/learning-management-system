FROM node:22
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app

EXPOSE 3000

CMD ["npm", "start"]

