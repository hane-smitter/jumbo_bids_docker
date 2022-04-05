FROM node:16-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/client/admin

COPY package*.json ./
RUN npm install --production
COPY . .

# RUN npm run build
# CMD ["node", "src/index.js"]
CMD ["sh", "-c", "npm start"]

#EXPOSE 5001
