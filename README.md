# NLP to SQL Converter

This project is an intelligent system for converting natural language queries into SQL queries. It includes a web interface and a backend for handling requests and interacting with a database.

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

The NLP to SQL Converter allows users to input queries in natural language and get corresponding SQL queries. This system is particularly useful for users without technical knowledge in SQL or databases, enabling them to interact with databases easily.

## Features

- Convert natural language queries to SQL.
- User authentication and authorization.
- Support for superusers with unlimited query capabilities.
- Track user queries and sessions.
- Intuitive web interface for query input and result display.

## Tech Stack

- **Frontend:** React, TypeScript, CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Prisma
- **Natural Language Processing:** Python, spaCy, Transformers
- **Authentication:** JWT, bcrypt

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Alexander-Softin/nlp-to-sql.git
   cd nlp-to-sql
