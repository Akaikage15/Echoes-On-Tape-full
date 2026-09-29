import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authService } from './services/auth.service';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Auth Service' });
});

app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    
    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ user: result.user, accessToken: result.accessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/auth/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const result = await authService.refresh(refreshToken);
    
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken: result.accessToken });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
});

app.post('/auth/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});