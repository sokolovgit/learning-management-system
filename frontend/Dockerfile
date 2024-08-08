FROM node:22
WORKDIR /app
COPY package.json package-lock.json /app/
RUN npm ci
COPY . /app

EXPOSE 5173

CMD ["npm", "run", "dev"]
