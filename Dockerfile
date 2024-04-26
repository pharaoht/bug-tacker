FROM node:20-alpine

WORKDIR /app

COPY package.json ./

COPY backend/package.json backend/
RUN npm run install --omit=dev

COPY backend/ backend/

USER node

CMD [ "npm", "start", "--prefix", "backend" ]

EXPOSE 8000