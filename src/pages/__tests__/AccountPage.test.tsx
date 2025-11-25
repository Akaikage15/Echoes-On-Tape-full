import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AccountPage } from '../AccountPage';
import { useSessionStore } from '../../lib/store';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock store
jest.mock('../../lib/store');

describe('AccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('должен перенаправить на главную, если пользователь не авторизован', () => {
    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      currentUser: null,
      isAuthenticated: false,
      logout: jest.fn(),
      setCurrentUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('должен отобразить информацию о пользователе с подпиской', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscriptionTier: 'pro' as const,
      subscriptionEndDate: '2024-12-31T00:00:00.000Z',
    };

    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      isAuthenticated: true,
      logout: jest.fn(),
      setCurrentUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Подписка Pro/i)).toBeInTheDocument();
  });

  it('должен отобразить сообщение об отсутствии подписки', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscriptionTier: 'none' as const,
    };

    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      isAuthenticated: true,
      logout: jest.fn(),
      setCurrentUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText('У вас нет активной подписки')).toBeInTheDocument();
    expect(screen.getByText('Оформить подписку')).toBeInTheDocument();
  });

  it('должен переключаться между вкладками', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscriptionTier: 'pro' as const,
    };

    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      isAuthenticated: true,
      logout: jest.fn(),
      setCurrentUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    // Проверяем вкладку "Подписка" (по умолчанию)
    expect(screen.getByText('Текущая подписка')).toBeInTheDocument();

    // Переключаемся на вкладку "Платежи"
    const paymentsTab = screen.getByRole('tab', { name: /Платежи/i });
    fireEvent.click(paymentsTab);

    await waitFor(() => {
      expect(screen.getByText('История платежей')).toBeInTheDocument();
    });

    // Переключаемся на вкладку "Скачанное"
    const downloadsTab = screen.getByRole('tab', { name: /Скачанное/i });
    fireEvent.click(downloadsTab);

    await waitFor(() => {
      expect(screen.getByText('Скачанные файлы')).toBeInTheDocument();
    });

    // Переключаемся на вкладку "Промокоды"
    const promocodesTab = screen.getByRole('tab', { name: /Промокоды/i });
    fireEvent.click(promocodesTab);

    await waitFor(() => {
      expect(screen.getByText('Активируйте промокоды для получения скидок')).toBeInTheDocument();
    });
  });

  it('должен вызвать logout при нажатии на кнопку выхода', () => {
    const mockLogout = jest.fn();
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscriptionTier: 'none' as const,
    };

    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      isAuthenticated: true,
      logout: mockLogout,
      setCurrentUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /Выйти/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('должен отображать дату окончания подписки', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      subscriptionTier: 'pro' as const,
      subscriptionEndDate: '2024-12-31T00:00:00.000Z',
    };

    (useSessionStore as unknown as jest.Mock).mockReturnValue({
      currentUser: mockUser,
      isAuthenticated: true,
      logout: jest.fn(),
      setCurrentUser: jest.fn(),
    });

    render(
      <BrowserRouter>
        <AccountPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Действует до')).toBeInTheDocument();
    expect(screen.getByText(/31 декабря 2024/i)).toBeInTheDocument();
  });
});
