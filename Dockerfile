FROM node:20.11.1-alpine3.19 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

ENV NODE_ENV production
ARG API_URL="http://localhost:8080"
ENV VITE_API_URL=${API_URL}
ARG TALLY_FORM_URL="#tally-open=form_id"
ENV VITE_TALLY_FORM_URL=${TALLY_FORM_URL}

RUN npm run build

FROM nginx:1.25.4-alpine3.18

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /var/www/html/

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]