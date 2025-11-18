import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Music } from 'lucide-react';
import { Button } from './ui/button';
import { currentUser } from '../lib/data';
import { AuthModal } from './AuthModal';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/releases', label: 'Релизы' },
    { href: '/artists', label: 'Артисты' },
    { href: '/blog', label: 'Блог' },
    { href: '/pricing', label: 'Тарифы' },
    { href: '/merch', label: 'Мерч' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 transition-colors hover:text-primary">
              <Music className="h-6 w-6" />
              <span className="font-['Bebas_Neue'] text-xl tracking-wide">
                ECHOES ON TAPE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm transition-colors hover:text-primary ${
                    isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {currentUser ? (
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{currentUser.name}</span>
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthModalOpen(true)}
                    className="hidden sm:inline-flex"
                  >
                    Войти
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-primary text-primary-foreground hover:bg-accent-secondary"
                  >
                    Подписаться
                  </Button>
                </>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-3 border-t border-border">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block py-2 text-sm transition-colors hover:text-primary ${
                    isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {!currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                >
                  Войти
                </Button>
              )}
            </nav>
          )}
        </div>
      </header>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
