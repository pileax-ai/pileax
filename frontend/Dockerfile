# base image
FROM node:22-alpine3.21 AS base
LABEL maintainer="pileaxai@gmail.com"
WORKDIR /app


# install packages
FROM base AS builder

RUN apk add --no-cache git

COPY . .
COPY env/.env.example env/.env
RUN yarn global add @quasar/cli
RUN yarn install --frozen-lockfile
RUN yarn build


# production stage
FROM nginx:stable-alpine AS production

COPY --from=builder /app/dist/spa /usr/share/nginx/html

COPY docker/nginx.conf.template /etc/nginx/conf.d/default.conf
COPY docker/config.js.template /app/
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
