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
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center ring-2 ring-primary">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-2">
                  {currentUser.name}
                </h1>
                <p className="text-muted-foreground">{currentUser.email}</p>
                {hasSubscription && (
                  <Badge className={`mt-2 gap-1 ${getTierColor(currentUser.subscriptionTier)}`}>
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
