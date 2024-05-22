import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const app = express();
const port = 3001;
const jwtSecret = 'your_jwt_secret';

app.use(cors());
app.use(express.json());

interface JwtPayload {
  userId: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

// Маршрут для регистрации
app.post('/register', async (req: Request, res: Response) => {
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
app.post('/login', async (req: Request, res: Response) => {
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

// Middleware для проверки JWT
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as JwtPayload;
    next();
  });
};

// Маршрут для отправки запроса
app.post('/query', authenticateToken, async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.sendStatus(403);

  // Проверка количества запросов
  const maxRequests = 3;
  if (user.requests >= maxRequests) {
    return res.status(403).json({ error: 'Превышено количество запросов' });
  }

  // Увеличиваем счетчик запросов
  await prisma.user.update({
    where: { id: userId },
    data: { requests: { increment: 1 } },
  });

  // Здесь ваша логика преобразования запроса
  const sqlQuery = `SELECT * FROM table WHERE query = '${req.body.query}'`;

  res.json({ sqlQuery });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
