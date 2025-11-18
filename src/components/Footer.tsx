import { Link } from 'react-router-dom';
import { Music, Send, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <Music className="h-5 w-5" />
              <span className="font-['Bebas_Neue'] text-lg tracking-wide">
                ECHOES ON TAPE
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Независимый музыкальный лейбл для тех, кто ищет что-то большее, чем просто музыку.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-['Bebas_Neue'] text-lg mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/releases" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Релизы
                </Link>
              </li>
              <li>
                <Link to="/artists" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Артисты
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Блог
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Тарифы
                </Link>
              </li>
              <li>
                <Link to="/merch" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Мерч
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-['Bebas_Neue'] text-lg mb-4">Информация</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  О лейбле
                </Link>
              </li>
              <li>
                <Link to="/about#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Оферта
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-['Bebas_Neue'] text-lg mb-4">Соцсети</h4>
            <div className="flex gap-4">
              <a
                href="https://t.me/echoesontape"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/echoesontape"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://music.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube Music"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-6 space-y-2">
              <a
                href="https://music.yandex.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Яндекс.Музыка
              </a>
              <a
                href="https://music.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                YouTube Music
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {currentYear} Echoes On Tape. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
