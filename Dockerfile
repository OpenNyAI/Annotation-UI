FROM node:20.11.1-alpine3.19 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV production
ENV VITE_API_URL "https://annotation-service.orangecoast-1b8d6c1e.centralindia.azurecontainerapps.io"

RUN npm run build

FROM nginx:1.25.4-alpine3.18

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /var/www/html/

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]