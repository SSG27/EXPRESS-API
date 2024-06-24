FROM node:22

WORKDIR /api

COPY package.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8000

CMD ["npm", "start"]