# NLP to SQL 

Этот проект представляет собой интеллектуальную систему преобразования запросов на естественном языке в запросы SQL. Он включает в себя веб-интерфейс и серверную часть для обработки запросов и взаимодействия с базой данных.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Переводчик NLP в SQL позволяет пользователям вводить запросы на естественном языке и получать соответствующие запросы SQL. Эта система особенно полезна для пользователей, не имеющих технических знаний в SQL или базах данных, поскольку позволяет им легко взаимодействовать с базами данных.

## Features

- Преобразование запросов на естественном языке в SQL.
- Аутентификация и авторизация пользователя.
- Поддержка суперпользователей с неограниченными возможностями запросов.
- Отслеживайте запросы и сеансы пользователей.
- Интуитивно понятный веб-интерфейс для ввода запроса и отображения результатов.

## Tech Stack

- **Frontend:** React, TypeScript, CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Prisma
- **Natural Language Processing:** Python, spaCy, Transformers
- **Authentication:** JWT, bcrypt

## Installation

Чтобы настроить проект локально, выполните следующие действия:

1. **Клонировать репозиторий:**
   ``` bash
   git-клон https://github.com/Alexander-Softin/nlp-to-sql.git
   cd nlp-to-sql

2. **Установка зависимостей:**
   ``` bash
   yarn install

3. **Set up environment variables:**

   Create a .env file in the root directory with the following variables:
   
   ``` bash
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret

4. **Set up the database:**
   ``` bash
   cd server
   yarn prisma migrate dev
   cd ..

5. **Run the application:**
   ``` bash
   yarn start

## Usage
1. - **Register a new user:**
Navigate to http://localhost:3000/register and fill in the registration form.

Log in:
Navigate to http://localhost:3000/login and log in with your credentials.

Convert a query:
On the main page, enter a natural language query and click "Generate Query" to get the corresponding SQL query.
