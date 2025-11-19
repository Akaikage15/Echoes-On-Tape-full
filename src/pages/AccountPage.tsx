import { useNavigate, Link } from 'react-router-dom';
import { User, CreditCard, Download, Tag, LogOut, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
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
import { User as UserType } from '../lib/data';

export function AccountPage() {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout, setCurrentUser } = useSessionStore();

  if (!isAuthenticated || !currentUser) {
    // Redirect to home if not authenticated
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancelSubscription = () => {
    const updatedUser: UserType = {
      ...currentUser,
      subscription: null,
    };
    setCurrentUser(updatedUser);
    alert('Ваша подписка отменена.');
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'lite': return 'Lite';
      case 'fan': return 'Fan';
      case 'pro': return 'Pro';
      default: return tier;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'bg-primary text-primary-foreground';
      case 'fan': return 'bg-primary/80 text-primary-foreground';
      case 'lite': return 'bg-primary/60 text-primary-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

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
                {currentUser.subscription && (
                  <Badge className={`mt-2 gap-1 ${getTierColor(currentUser.subscription.tier)}`}>
                    <Crown className="h-3 w-3" />
                    Подписка {getTierLabel(currentUser.subscription.tier)}
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="subscription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subscription">Подписка</TabsTrigger>
              <TabsTrigger value="payments" disabled>Платежи</TabsTrigger>
              <TabsTrigger value="downloads" disabled>Скачанное</TabsTrigger>
              <TabsTrigger value="promocodes" disabled>Промокоды</TabsTrigger>
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

                {currentUser.subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Тариф</p>
                        <p className="font-['Bebas_Neue'] text-2xl">
                          {getTierLabel(currentUser.subscription.tier)}
                        </p>
                      </div>
                      <Badge className={getTierColor(currentUser.subscription.tier)}>
                        {currentUser.subscription.status}
                      </Badge>
                    </div>

                    <div className="flex gap-3">
                      <Link to="/pricing" className="flex-1">
                        <Button variant="outline" className="w-full">
                          Изменить тариф
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
                            Отменить подписку
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Отменить подписку?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Автопродление будет отключено. Это действие нельзя будет отменить.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Назад</AlertDialogCancel>
                            <AlertDialogAction onClick={handleCancelSubscription}>
                              Отменить подписку
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">У вас нет активной подписки</p>
                    <Link to="/pricing">
                      <Button className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                        Оформить подписку
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
