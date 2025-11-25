/**
 * Vercel Serverless Function Entry Point
 * Экспортирует Express app для Vercel
 */

import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app';

// Экспортируем app для Vercel
export default app;
