import axios from 'axios';
import { useSessionStore } from './store'; // Import useSessionStore to get the token

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = useSessionStore.getState().token; // Get token from store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and auto-refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если получили 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data;

          // Сохраняем новый access token
          useSessionStore.getState().setToken(accessToken);

          // Повторяем оригинальный запрос с новым токеном
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Если обновление токена не удалось - разлогиниваем
        useSessionStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Для 403 или других ошибок - разлогиниваем
    if (error.response?.status === 403) {
      useSessionStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// ============================================
// Account API
// ============================================

export interface UpdateProfileDto {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
  };
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Получить данные профиля текущего пользователя
 */
export const getProfile = async () => {
  const response = await apiClient.get('/account/profile');
  return response.data;
};

/**
 * Обновить профиль пользователя
 */
export const updateProfile = async (data: UpdateProfileDto) => {
  const response = await apiClient.put('/account/profile', data);
  return response.data;
};

/**
 * Изменить пароль
 */
export const changePassword = async (data: ChangePasswordDto) => {
  const response = await apiClient.put('/account/password', data);
  return response.data;
};

/**
 * Удалить аккаунт
 */
export const deleteAccount = async () => {
  const response = await apiClient.delete('/account');
  return response.data;
};

// ============================================
// Auth API (refresh tokens)
// ============================================

/**
 * Обновить access token с помощью refresh token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data;
};

/**
 * Выход (удаление refresh token)
 */
export const logout = async (refreshToken?: string) => {
  const response = await apiClient.post('/auth/logout', { refreshToken });
  return response.data;
};
