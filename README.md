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
   ``` баш
   git-клон https://github.com/Alexander-Softin/nlp-to-sql.git
   cd nlp-to-sql

2. **Install dependencies:**
   yarn install
