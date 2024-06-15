# Используем официальный образ Node.js в качестве базового
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и yarn.lock в рабочую директорию
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install

# Копируем все файлы в рабочую директорию
COPY . .

# Устанавливаем зависимости для server и client
RUN yarn install --cwd server
RUN yarn install --cwd client

# Сборка проекта
RUN yarn build --cwd client

# Устанавливаем переменные окружения
ENV NODE_ENV production

# Открываем порт для приложения
EXPOSE 3000

# Команда для запуска приложения
CMD ["yarn", "start"]
