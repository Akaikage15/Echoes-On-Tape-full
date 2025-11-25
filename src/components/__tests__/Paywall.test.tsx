import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Paywall } from '../Paywall';

describe('Paywall Component', () => {
  it('renders the default message for a required tier', () => {
    render(
      <BrowserRouter>
        <Paywall requiredTier="fan" />
      </BrowserRouter>
    );

    expect(screen.getByText('Доступ ограничен')).toBeInTheDocument();
    expect(screen.getByText(/Этот контент доступен для подписчиков тарифа "Fan" и выше/)).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    const customMessage = 'Это специальное сообщение для кастомного пейволла.';
    render(
      <BrowserRouter>
        <Paywall requiredTier="pro" message={customMessage} />
      </BrowserRouter>
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('renders a link to the pricing page', () => {
    render(
      <BrowserRouter>
        <Paywall requiredTier="lite" />
      </BrowserRouter>
    );

    const link = screen.getByRole('link', { name: 'Посмотреть тарифы' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/pricing');
  });
});
