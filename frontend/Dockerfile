# Сборка
FROM node:18 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Запуск
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
