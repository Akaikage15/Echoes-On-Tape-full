import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from '../AuthModal';
import { useSessionStore } from '../../lib/store';
import apiClient from '../../lib/api';

// Mock dependencies
jest.mock('../../lib/store');
jest.mock('../../lib/api');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain default behavior
  useNavigate: () => jest.fn(), // mock useNavigate
}));
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockUseSessionStore = useSessionStore as jest.Mock;
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthModal Component', () => {
  let setToken: jest.Mock;
  let setCurrentUser: jest.Mock;
  let onClose: jest.Mock;

  beforeEach(() => {
    setToken = jest.fn();
    setCurrentUser = jest.fn();
    onClose = jest.fn();
    mockUseSessionStore.mockReturnValue({
      setToken,
      setCurrentUser,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login and register tabs', () => {
    render(<AuthModal open={true} onClose={onClose} />);
    expect(screen.getByText('Вход')).toBeInTheDocument();
    expect(screen.getByText('Регистрация')).toBeInTheDocument();
  });

  it('allows user to type in login form', async () => {
    const user = userEvent.setup();
    render(<AuthModal open={true} onClose={onClose} />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Пароль');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        token: 'fake-token',
        user: { id: '1', name: 'Test', email: 'test@example.com' },
      },
    };
    mockedApiClient.post.mockResolvedValue(mockResponse);

    render(<AuthModal open={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setToken).toHaveBeenCalledWith('fake-token');
      expect(setCurrentUser).toHaveBeenCalledWith(mockResponse.data.user);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('handles failed login and shows an error message', async () => {
    const user = userEvent.setup();
    const mockError = {
      response: { data: { message: 'Invalid credentials' } },
    };
    mockedApiClient.post.mockRejectedValue(mockError);

    // Suppress expected console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<AuthModal open={true} onClose={onClose} />);

    await user.type(screen.getByLabelText('Email'), 'wrong@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
    expect(setToken).not.toHaveBeenCalled();
    expect(setCurrentUser).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
  
  it('switches to register tab and handles successful registration', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      data: {
        token: 'new-fake-token',
        user: { id: '2', name: 'New User', email: 'new@example.com' },
      },
    };
    mockedApiClient.post.mockResolvedValue(mockResponse);

    render(<AuthModal open={true} onClose={onClose} />);
    
    // Switch to Register tab
    await user.click(screen.getByText('Регистрация'));
    
    // Fill out form
    await user.type(screen.getByLabelText('Имя'), 'New User');
    // Note: The email/password state is shared between tabs in the component, so we need to clear it or use different inputs.
    // The current implementation uses different `id`s, so it should be fine.
    await user.type(screen.getByLabelText('Email'), 'new@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'newpassword123');
    await user.click(screen.getByRole('button', { name: 'Зарегистрироваться' }));

    await waitFor(() => {
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/register', {
        name: 'New User',
        email: 'new@example.com',
        password: 'newpassword123',
      });
      expect(setToken).toHaveBeenCalledWith('new-fake-token');
      expect(setCurrentUser).toHaveBeenCalledWith(mockResponse.data.user);
      expect(onClose).toHaveBeenCalled();
    });
  });
});
