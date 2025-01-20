import dotenv from 'dotenv';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const DB_PORT = process.env.DB_PORT || '4000';

export const DATABASE_URL = process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const PRISMA_LOG_LEVEL = process.env.PRISMA_LOG_LEVEL || 'info';