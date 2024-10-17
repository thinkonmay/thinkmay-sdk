FROM node:21.7.3 as build

COPY package.json .
COPY package-lock.json .

RUN npm i -f

COPY . .

RUN npm run build

FROM nginx:latest

EXPOSE 80

RUN rm -rf /usr/share/nginx/html && mkdir /usr/share/nginx/html
COPY --from=build dist /usr/share/nginx/html

