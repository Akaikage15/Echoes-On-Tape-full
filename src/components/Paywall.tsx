import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Lock } from 'lucide-react';

interface PaywallProps {
  requiredTier: 'lite' | 'fan' | 'pro';
  message?: string;
}

export function Paywall({ requiredTier, message }: PaywallProps) {
  const tierLabels = {
    lite: 'Lite',
    fan: 'Fan',
    pro: 'Pro',
  };

  return (
    <div className="relative">
      <div className="blur-sm select-none">
        {/* This is where the protected content would be */}
        <div className="h-64 bg-secondary rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground italic">Содержимое скрыто</p>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-8 text-center">
        <Lock className="h-12 w-12 text-primary mb-4" />
        <h3 className="font-['Bebas_Neue'] text-3xl mb-2">
          Доступ ограничен
        </h3>
        <p className="text-muted-foreground mb-6">
          {message || `Этот контент доступен для подписчиков тарифа "${tierLabels[requiredTier]}" и выше.`}
        </p>
        <Link to="/pricing">
          <Button className="bg-primary text-primary-foreground hover:bg-accent-secondary">
            Посмотреть тарифы
          </Button>
        </Link>
      </div>
    </div>
  );
}
