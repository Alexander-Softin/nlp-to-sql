import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'Пользователь зарегистрирован', user });
  } catch (error) {
    res.status(400).json({ error: 'Не удалось зарегистрировать пользователя' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
