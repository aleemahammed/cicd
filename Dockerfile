FROM node:18

WORKDIR /app

COPY package*.json ./

# Non-interactive npm install
RUN npm install --no-progress --no-audit --silent

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
