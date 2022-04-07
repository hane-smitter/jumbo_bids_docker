FROM node:16-alpine as build

ENV NODE_ENV=production

WORKDIR /usr/src/client/admin

COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

FROM nginx
COPY --from=build /usr/src/client/admin/build /usr/share/nginx/html
COPY ./server-engine/nginx.conf /etc/nginx/sites-enabled/default

# Expose 7000