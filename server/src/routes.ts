import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, checkRequestLimit, checkUnauthenticatedRequestLimit } from './middleware';

const prisma = new PrismaClient();
const router = Router();

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

const jwtSecret = process.env.JWT_SECRET || 'my_super_secret_jwt_key_1234567890';

interface JwtPayload {
  userId: number;
}

// Маршрут для регистрации
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Проверка на допустимость почты
  if (!email.endsWith('@mail.com')) {
    return res.status(400).json({ error: 'Email должен заканчиваться на @mail.com' });
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.json({ message: 'Пользователь зарегистрирован успешно' });
  } catch (error) {
    res.status(400).json({ error: 'Пользователь с таким email уже существует' });
  }
});

// Маршрут для входа
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' });

    await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    res.json({ token });
  } else {
    res.status(401).json({ error: 'Неправильный email или пароль' });
  }

});

// Маршрут для отправки запроса
router.post('/query', authenticateToken, checkRequestLimit, async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  console.log('Processing query for user:', userId);
  // Здесь ваша логика преобразования запроса
  const sqlQuery = `SELECT * FROM table WHERE query = '${req.body.query}'`;
  console.log('SQL query:', sqlQuery);
  res.json({ sqlQuery });
});

// Маршрут для отправки запроса неавторизованными пользователями
router.post('/query-unauthed', checkUnauthenticatedRequestLimit, async (req: Request, res: Response) => {
  // Здесь ваша логика преобразования запроса для неавторизованных пользователей
  console.log('Received request from IP:', req.ip);
  const sqlQuery = `SELECT * FROM table WHERE query = '${req.body.query}'`;

  res.json({ sqlQuery });
});

export default router;
