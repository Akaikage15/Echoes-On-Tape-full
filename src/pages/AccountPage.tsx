import { useNavigate, Link } from 'react-router-dom';
import { User, CreditCard, Download, Tag, Settings, LogOut, Crown } from 'lucide-react';
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
import { currentUser, setCurrentUser, paymentHistory, downloadedMaterials, promoCodes } from '../lib/data';

export function AccountPage() {
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/');
    return null;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
    window.location.reload();
  };

  const handleCancelSubscription = () => {
    alert('Автопродление подписки отменено. Доступ сохранится до ' + currentUser.subscriptionExpiry);
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
                  <Badge className={`mt-2 gap-1 ${getTierColor(currentUser.subscription)}`}>
                    <Crown className="h-3 w-3" />
                    Подписка {getTierLabel(currentUser.subscription)}
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

                {currentUser.subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Тариф</p>
                        <p className="font-['Bebas_Neue'] text-2xl">
                          {getTierLabel(currentUser.subscription)}
                        </p>
                      </div>
                      <Badge className={getTierColor(currentUser.subscription)}>
                        Активна
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Следующее списание</p>
                        <p className="font-medium">
                          {new Date(currentUser.nextPayment || '').toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="p-4 bg-secondary/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Активна до</p>
                        <p className="font-medium">
                          {new Date(currentUser.subscriptionExpiry || '').toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
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
                              Автопродление будет отключено, но доступ к эксклюзивному контенту 
                              сохранится до конца оплаченного периода.
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

            {/* Payments Tab */}
            <TabsContent value="payments">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-['Bebas_Neue'] text-2xl mb-4">История платежей</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentHistory.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.date).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>{payment.amount}₽</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-success border-success">
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-['Bebas_Neue'] text-2xl mb-4">Скачанные материалы</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Дата скачивания</TableHead>
                      <TableHead>Действие</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {downloadedMaterials.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(item.date).toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost" className="gap-2">
                            <Download className="h-4 w-4" />
                            Скачать снова
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Promo Codes Tab */}
            <TabsContent value="promocodes">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="font-['Bebas_Neue'] text-2xl mb-4">Ваши промокоды</h3>
                <div className="space-y-4">
                  {promoCodes.map(promo => (
                    <div key={promo.id} className="p-4 bg-secondary/50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Tag className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-['Bebas_Neue'] text-xl">{promo.code}</p>
                          <p className="text-sm text-muted-foreground">{promo.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">{promo.discount}</Badge>
                        <p className="text-xs text-muted-foreground">
                          До {new Date(promo.validUntil).toLocaleDateString('ru-RU')}
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => {
                            navigator.clipboard.writeText(promo.code);
                            alert('Промокод скопирован!');
                          }}
                        >
                          Копировать
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Используйте промокоды в{' '}
                    <Link to="/merch" className="text-primary hover:underline">
                      магазине мерча
                    </Link>
                    {' '}для получения скидки
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
