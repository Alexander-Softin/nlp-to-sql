import { Router } from 'express';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken, checkRequestLimit, checkUnauthenticatedRequestLimit } from './middleware';
import { spawn } from 'child_process';

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
  isSuperUser: boolean;
}

// Маршрут для генерации суперпользовательского ключа
router.post('/generate-key', authenticateToken, async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  try {
    const superUserKey = 'SUPER_SECRET_KEY_' + Math.random().toString(36).substr(2, 9);
    const hashedKey = await bcrypt.hash(superUserKey, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { superUserKey: hashedKey, isSuperUser: true },
    });

    res.json({ superUserKey });
  } catch (error) {
    console.error('Ошибка при генерации суперпользовательского ключа:', error);
    res.status(500).json({ error: 'Произошла ошибка при генерации ключа.' });
  }
});



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
  const { email, password, superUserKey } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && await bcrypt.compare(password, user.password)) {
    let isSuperUser = false;

    if (superUserKey) {
      if (user.superUserKey) {
        isSuperUser = await bcrypt.compare(superUserKey, user.superUserKey);
        if (!isSuperUser) {
          return res.status(401).json({ error: 'Неправильный суперпользовательский ключ' });
        }
      } else {
        return res.status(401).json({ error: 'Суперпользовательский ключ не найден' });
      }
    }

    const token = jwt.sign({ userId: user.id, isSuperUser }, jwtSecret, { expiresIn: '1h' });

    await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    res.json({ token, isSuperUser });
  } else {
    res.status(401).json({ error: 'Неправильный email или пароль' });
  }
});





// Обновление маршрута /query
router.post('/query', authenticateToken, checkRequestLimit, async (req, res) => {
  const { query } = req.body;
  const { userId, isSuperUser } = req.user as JwtPayload;
  const pythonProcess = spawn('python', ['./src/python/translate.py', query]);

  let dataString = '';
  pythonProcess.stdout.on('data', function (data) {
    dataString += data.toString();
  });

  pythonProcess.stderr.on('data', function (data) {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', async function (code) {
    if (code !== 0) {
      return res.status(500).json({ error: 'Failed to generate SQL query' });
    }

    // Записываем запрос и ответ в базу данных для всех пользователей
    await prisma.requestLog.create({
      data: {
        userId: userId,
        query: query,
        response: dataString,
      },
    });

    res.json({ sqlQuery: dataString });
  });
});




// Маршрут для отправки запроса неавторизованными пользователями
router.post('/query-unauthed', checkUnauthenticatedRequestLimit, async (req: Request, res: Response) => {
  const { query } = req.body;
  const pythonProcess = spawn('python', ['./src/python/translate.py', query]);
  let sqlQuery = '';

  pythonProcess.stdout.on('data', (data) => {
    sqlQuery += data.toString();
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: 'Failed to generate SQL query' });
    }

    // Записываем запрос и ответ в базу данных
    await prisma.requestLog.create({
      data: {
        ip: req.ip,
        query: query,
        response: sqlQuery,
      },
    });

    res.json({ sqlQuery });
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
});





// Маршрут для получения истории запросов
router.get('/history', authenticateToken, async (req, res) => {
  const { userId } = req.user as JwtPayload;
  const requestLogs = await prisma.requestLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ requestLogs });
});

router.delete('/history', authenticateToken, async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;
  try {
    await prisma.requestLog.deleteMany({
      where: { userId: userId },
    });
    res.json({ message: 'История запросов успешно очищена.' });
  } catch (error) {
    console.error('Ошибка при очистке истории запросов:', error);
    res.status(500).json({ error: 'Произошла ошибка при очистке истории запросов.' });
  }
});
export default router;
