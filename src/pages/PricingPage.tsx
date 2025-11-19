import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { useSessionStore } from '../lib/store';
import { AuthModal } from '../components/AuthModal';
import { User } from '../lib/data';

export function PricingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, setCurrentUser } = useSessionStore();

  const handleSelectPlan = (tier: 'lite' | 'fan' | 'pro') => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      // Simulate payment flow and subscription update
      alert(`Симуляция успешной подписки на тариф ${tier}.`);
      const updatedUser: User = {
        ...currentUser!,
        subscription: {
          tier: tier,
          status: 'active',
        },
      };
      setCurrentUser(updatedUser);
      navigate('/account');
    }
  };

  const tiers = [
    {
      name: 'Lite',
      id: 'lite',
      price: 200,
      description: 'Базовый доступ к эксклюзивному контенту',
      features: [
        { name: 'Ранний доступ к релизам (3 дня)', included: true },
        { name: 'Эксклюзивные треки Lite', included: true },
        { name: 'Доступ к закрытым постам блога', included: true },
        { name: 'Скидка 10% на мерч', included: true },
        { name: 'Участие в голосованиях', included: false },
        { name: 'Доступ к Fan-контенту', included: false },
        { name: 'PRO-библиотека (семплы, пресеты)', included: false },
        { name: 'Приоритетная отправка демо', included: false },
      ],
    },
    {
      name: 'Fan',
      id: 'fan',
      price: 500,
      description: 'Полный фан-опыт с максимальным погружением',
      popular: true,
      features: [
        { name: 'Все из Lite', included: true },
        { name: 'Эксклюзивные треки Fan', included: true },
        { name: 'Backstage-видео и контент', included: true },
        { name: 'Участие в голосованиях', included: true },
        { name: 'Закрытый Telegram-канал', included: true },
        { name: 'Скидка 15% на мерч', included: true },
        { name: 'PRO-библиотека', included: false },
        { name: 'Приоритетная отправка демо', included: false },
      ],
    },
    {
      name: 'Pro',
      id: 'pro',
      price: 1500,
      description: 'Для музыкантов и продюсеров',
      features: [
        { name: 'Все из Fan', included: true },
        { name: 'PRO-библиотека (семплы, пресеты, MIDI)', included: true },
        { name: 'Разборы треков от артистов', included: true },
        { name: 'Проекты DAW', included: true },
        { name: 'Мастер-классы по продакшену', included: true },
        { name: 'Приоритетная отправка демо', included: true },
        { name: 'Участие в PRO-голосованиях', included: true },
        { name: 'Скидка 20% на мерч', included: true },
      ],
    },
  ];

  const faqs = [
    {
      question: 'Можно ли отменить подписку?',
      answer: 'Да, вы можете отменить подписку в любой момент через личный кабинет. При отмене автопродление прекратится, но доступ сохранится до конца оплаченного периода.',
    },
    {
      question: 'Возможен ли возврат средств?',
      answer: 'Да, мы предоставляем возврат средств в течение 7 дней с момента оплаты, если вы не использовали подписку.',
    },
    {
      question: 'Как изменить тариф?',
      answer: 'Вы можете повысить или понизить тариф в любой момент через личный кабинет. При повышении тарифа будет учтена стоимость неиспользованного периода.',
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем банковские карты (Visa, Mastercard, МИР), ЮMoney, QIWI и другие популярные способы оплаты через ЮKassa.',
    },
    {
      question: 'Продлевается ли подписка автоматически?',
      answer: 'Да, подписка автоматически продлевается каждый месяц, пока вы не отмените автопродление. Вы получите уведомление за 3 дня до списания средств.',
    },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Выберите подписку
          </h1>
          <p className="text-lg text-muted-foreground">
            Получите доступ к эксклюзивному контенту, прямой связи с артистами 
            и уникальным материалам для музыкантов
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-lg p-8 ${
                tier.popular
                  ? 'bg-gradient-to-b from-primary/10 to-card ring-2 ring-primary'
                  : 'bg-card'
              } transition-all hover:shadow-lg`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Популярный
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="font-['Bebas_Neue'] text-3xl tracking-wide mb-2">
                  {tier.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-['Bebas_Neue']">{tier.price}₽</span>
                  <span className="text-muted-foreground">/месяц</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-foreground' : 'text-muted-foreground/50'
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(tier.id as 'lite' | 'fan' | 'pro')}
                className={`w-full ${
                  tier.popular
                    ? 'bg-primary text-primary-foreground hover:bg-accent-secondary'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
                disabled={currentUser?.subscription?.tier === tier.id}
              >
                {currentUser?.subscription?.tier === tier.id
                  ? 'Текущий тариф'
                  : 'Выбрать'}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-center mb-8">
            Частые вопросы
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-lg px-6 border-0"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-medium">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
