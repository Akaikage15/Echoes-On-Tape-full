FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# В будущем здесь будет генерация Prisma Client
# RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run dev"]
