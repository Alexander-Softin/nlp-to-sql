import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config'

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'my_super_secret_jwt_key_1234567890';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

interface JwtPayload {
  userId: number;
  isSuperUser: boolean;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  if (!authHeader) return res.sendStatus(401);

  const token = authHeader.split(' ')[1];
  console.log('Token:', token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log('JWT verification error:', err);
      return res.sendStatus(403);
    }
    req.user = user as JwtPayload;
    console.log('JWT verified, user:', req.user);
    next();
  });
};


export const checkRequestLimit = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, isSuperUser } = req.user as JwtPayload;
  console.log('Checking request limit for user:', userId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    console.log('User not found:', userId);
    return res.sendStatus(403);
  }

  if (isSuperUser) {
    return next();
  }

  const currentTime = new Date();
  const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
  console.log('Current time:', currentTime);
  console.log('Five minutes ago:', fiveMinutesAgo);

  const requestLogs = await prisma.requestLog.findMany({
    where: {
      userId: userId,
      createdAt: { gte: fiveMinutesAgo },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const requestCount = requestLogs.length;
  console.log('Request count:', requestCount);

  const maxRequests = 3;
  if (requestCount >= maxRequests) {
    const lastRequestTime = requestLogs[0].createdAt;
    const timeLeft = 5 * 60 * 1000 - (currentTime.getTime() - lastRequestTime.getTime());
    const minutesLeft = Math.floor(timeLeft / 60000);
    const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
    return res.status(403).json({
      error: 'Превышено количество запросов',
      timeLeft: `${minutesLeft} минут ${secondsLeft} секунд до снятия лимита`
    });
  }

  next();
};







export const checkUnauthenticatedRequestLimit = async (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip;

  const currentTime = new Date();
  const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
  try {
    
    await prisma.requestLog.deleteMany({
      where: {
        ip: clientIp,
        createdAt: { lt: fiveMinutesAgo },
      },
    });

   
    const requestLogs = await prisma.requestLog.findMany({
      where: {
        ip: clientIp,
        createdAt: { gte: fiveMinutesAgo },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const requestCount = requestLogs.length;

    
    const maxRequests = 1;
    if (requestCount >= maxRequests) {
      const lastRequestTime = requestLogs[0].createdAt;
      const timeLeft = 5 * 60 * 1000 - (currentTime.getTime() - lastRequestTime.getTime());
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
      return res.status(403).json({
        error: 'Превышено количество запросов для неавторизованных пользователей.',
        timeLeft: `У вас:${minutesLeft} минут ${secondsLeft} секунд до снятия лимита`
      });
    }

    next();
  } catch (error) {
    // Обработка ошибок базы данных
    console.error('Ошибка при работе с базой данных:', error);
    res.status(500).json({ error: 'Произошла ошибка при работе с базой данных' });
  }
};





