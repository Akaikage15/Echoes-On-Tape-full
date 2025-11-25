import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  CreditCard,
  Download,
  Tag,
  LogOut,
  Crown,
  Calendar,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { useSessionStore } from '../lib/store';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionTier } from '../types';
import { toast } from 'sonner';

export function AccountPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, setCurrentUser } =
    useSessionStore();
  const { tier, subscriptionEndDate } = useSubscription();
  const [activeTab, setActiveTab] = useState('subscription');

  // Логирование для отладки
  useEffect(() => {
    console.log('AccountPage mounted', {
      currentUser,
      isAuthenticated,
      tier,
      subscriptionEndDate,
      subscriptionTier: currentUser?.subscriptionTier,
      bio: currentUser?.bio,
      social_links: currentUser?.social_links,
    });
  }, [currentUser, isAuthenticated, tier, subscriptionEndDate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelSubscription = () => {
    if (!currentUser) return;

    // Simulate canceling the subscription
    const updatedUser = {
      ...currentUser,
      subscriptionTier: 'none' as SubscriptionTier,
      subscriptionEndDate: undefined,
    };
    setCurrentUser(updatedUser);
    toast.success('Ваша подписка успешно отменена.');
  };

  const getTierLabel = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'lite':
        return 'Lite';
      case 'fan':
        return 'Fan';
      case 'pro':
        return 'Pro';
      case 'none':
        return 'Нет подписки';
      default:
        return tier;
    }
  };

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return 'bg-primary text-primary-foreground';
      case 'fan':
        return 'bg-primary/80 text-primary-foreground';
      case 'lite':
        return 'bg-primary/60 text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Неверная дата';
    }
  };

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  const hasSubscription = currentUser.subscriptionTier !== 'none';

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Аватар - фиксированный размер */}
              <div className="flex-shrink-0 w-20 h-20 rounded-full bg-secondary flex items-center justify-center ring-2 ring-primary overflow-hidden">
                {currentUser.avatar_url ? (
                  <img 
                    src={`http://localhost:3001${currentUser.avatar_url}`} 
                    alt={currentUser.name || 'Avatar'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
              </div>
              
              {/* Информация профиля */}
              <div className="flex-1 min-w-0">
                <h1 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-2">
                  {currentUser.name || 'Пользователь'}
                </h1>
                <p className="text-muted-foreground">{currentUser.email}</p>
                
                {/* Биография */}
                {currentUser.bio && (
                  <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                    {currentUser.bio}
                  </p>
                )}
                
                {/* Социальные сети */}
                {currentUser.social_links && Object.keys(currentUser.social_links).length > 0 && (
                  <div className="flex gap-3 mt-4">
                    {currentUser.social_links.instagram && (
                      <a 
                        href={currentUser.social_links.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {currentUser.social_links.twitter && (
                      <a 
                        href={currentUser.social_links.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </a>
                    )}
                    {currentUser.social_links.spotify && (
                      <a 
                        href={currentUser.social_links.spotify} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                )}
                
                {hasSubscription && (
                  <Badge className={`mt-3 gap-1 ${getTierColor(currentUser.subscriptionTier)}`}>
                    <Crown className="h-3 w-3" />
                    Подписка {getTierLabel(currentUser.subscriptionTier)}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/settings" className="gap-2">
                  <User className="h-4 w-4" />
                  Настройки
                </Link>
              </Button>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscription">Подписка</TabsTrigger>
              <TabsTrigger value="payments">Платежи</TabsTrigger>
              <TabsTrigger value="downloads">Скачанное</TabsTrigger>
              <TabsTrigger value="promocodes">Промокоды</TabsTrigger>
            </TabsList>

            {/* Subscription Tab */}
            <TabsContent value="subscription" className="space-y-6">
              <div className="bg-card p-6 rounded-lg space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-['Bebas_Neue'] text-2xl mb-1">
                      Текущая подписка
                    </h3>
                    <p className="text-muted-foreground">
                      Управление вашим тарифом и автопродлением
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>

                {hasSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Тариф</p>
                        <p className="font-['Bebas_Neue'] text-2xl">
                          {getTierLabel(currentUser.subscriptionTier)}
                        </p>
                      </div>
                      <Badge
                        className={getTierColor(currentUser.subscriptionTier)}
                      >
                        Активна
                      </Badge>
                    </div>

                    {subscriptionEndDate && (
                      <div className="flex items-center gap-2 p-4 bg-secondary/50 rounded-lg">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Действует до
                          </p>
                          <p className="font-medium">
                            {formatDate(subscriptionEndDate)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Link to="/pricing" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Изменить тариф
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 text-destructive hover:text-destructive"
                          >
                            Отменить подписку
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Отменить подписку?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Автопродление будет отключено. Это действие нельзя
                              будет отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Назад</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCancelSubscription}
                            >
                              Отменить подписку
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      У вас нет активной подписки
                    </p>
                    <Link to="/pricing">
                      <Button className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                        Оформить подписку
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-['Bebas_Neue'] text-2xl mb-1">
                      История платежей
                    </h3>
                    <p className="text-muted-foreground">
                      Все ваши транзакции и покупки
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>

                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    История платежей пока пуста
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Здесь будут отображаться все ваши транзакции
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads" className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-['Bebas_Neue'] text-2xl mb-1">
                      Скачанные файлы
                    </h3>
                    <p className="text-muted-foreground">
                      Треки, сэмплы и пресеты из PRO-библиотеки
                    </p>
                  </div>
                  <Download className="h-8 w-8 text-primary" />
                </div>

                <div className="text-center py-12">
                  <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Вы ещё ничего не скачали
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Скачанные файлы будут доступны здесь
                  </p>
                  {hasSubscription && (
                    <Link to="/pro-library" className="inline-block mt-4">
                      <Button variant="outline">
                        Перейти в PRO-библиотеку
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Promocodes Tab */}
            <TabsContent value="promocodes" className="space-y-6">
              <div className="bg-card p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-['Bebas_Neue'] text-2xl mb-1">
                      Промокоды
                    </h3>
                    <p className="text-muted-foreground">
                      Активируйте промокоды для получения скидок
                    </p>
                  </div>
                  <Tag className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Введите промокод"
                      className="flex-1 px-4 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button>Активировать</Button>
                  </div>

                  <div className="text-center py-8">
                    <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      У вас нет активных промокодов
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Следите за акциями в наших соцсетях
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
