FROM node

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install

RUN npm install mysql

COPY . .

CMD ["node", "index.js"]