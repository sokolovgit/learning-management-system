# Base image
FROM node:lts-alpine as base

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY . /app

# Stage for development
FROM base as development

CMD ["npm", "run", "dev"]

# Stage for production
FROM base as production

RUN npm run build

FROM nginx:stable-alpine as final

COPY --from=production /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
