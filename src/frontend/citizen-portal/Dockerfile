# base image
FROM node:14.17 as build-deps

# set working directory
ENV NODE_ROOT /usr/src/app

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package-lock.json yarn.lock ./

RUN npm install
RUN npm audit fix

COPY . .

RUN npm run build-prod

FROM registry.access.redhat.com/ubi8/nginx-118

COPY --from=build-deps /usr/src/app/src/favicon.ico /usr/share/nginx/html
COPY --from=build-deps /usr/src/app/dist/citizen-portal /usr/share/nginx/html
COPY --from=build-deps /usr/src/app/nginx.conf /opt/app-root/etc/nginx.default.d/default.conf

EXPOSE 8080

CMD ["sh", "-c", "nginx -g 'daemon off;'"]
