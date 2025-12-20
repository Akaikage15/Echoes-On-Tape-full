import { Link } from 'react-router-dom';
import { CreditCard, Calendar, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
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
} from './ui/alert-dialog';
import { cn } from './ui/utils';

interface SubscriptionStatusCardProps {
  tier: SubscriptionTier;
  endDate?: string;
  onCancel: () => void;
}

export function SubscriptionStatusCard({ tier, endDate, onCancel }: SubscriptionStatusCardProps) {
  const isActive = tier !== 'none';
  
  // Рассчитываем прогресс (сколько дней прошло из месяца)
  // Для демо считаем, что подписка на 30 дней
  const calculateProgress = () => {
    if (!endDate) return 0;
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    // Предполагаем, что подписка была оформлена 30 дней назад от даты окончания
    const start = end - (30 * 24 * 60 * 60 * 1000); 
    const total = end - start;
    const elapsed = now - start;
    const percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return percent;
  };

  const calculateDaysLeft = () => {
    if (!endDate) return 0;
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getTierLabel = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'lite': return 'Lite';
      case 'fan': return 'Fan';
      case 'pro': return 'Pro';
      case 'none': return 'Нет подписки';
      default: return tier;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return 'Неверная дата';
    }
  };

  const daysLeft = calculateDaysLeft();
  const progress = calculateProgress();

  return (
    <Card className="relative overflow-hidden border-border bg-card">
       {/* Gradient Background based on tier */}
       <div className={cn(
        "absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-500",
        tier === 'pro' && "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
        tier === 'fan' && "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500",
        tier === 'lite' && "bg-gradient-to-br from-gray-500 via-slate-500 to-zinc-500"
      )} />

      <CardHeader>
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="flex items-center gap-2 font-['Bebas_Neue'] text-3xl tracking-wide">
            {tier === 'pro' && <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />}
            {getTierLabel(tier)}
          </CardTitle>
          <Badge variant={isActive ? 'default' : 'destructive'} className="uppercase px-3 py-1 text-xs font-bold tracking-wider">
            {isActive ? 'Активна' : 'Неактивна'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {isActive ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Истекает через</span>
                <span className="text-primary">{daysLeft} дн.</span>
              </div>
              <Progress value={progress} className="h-2 bg-secondary" indicatorClassName={cn(
                tier === 'pro' && "bg-gradient-to-r from-purple-500 to-pink-500",
                tier === 'fan' && "bg-gradient-to-r from-blue-500 to-cyan-500",
                tier === 'lite' && "bg-gradient-to-r from-gray-500 to-slate-500"
              )} />
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary/30 backdrop-blur-sm rounded-lg border border-white/5">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Дата окончания</p>
                <p className="font-semibold text-sm">{formatDate(endDate)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
             <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
             <p className="text-muted-foreground mb-4">
               Оформите подписку, чтобы получить доступ к эксклюзивным материалам, трекам и ранним релизам.
             </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 relative z-10 pt-2">
        {isActive ? (
          <>
            <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors" asChild>
              <Link to="/pricing">Сменить тариф</Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors">
                  Отменить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Отменить подписку?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы потеряете доступ к эксклюзивному контенту после окончания текущего периода.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Оставить</AlertDialogCancel>
                  <AlertDialogAction onClick={onCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Отменить подписку
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : (
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" asChild>
            <Link to="/pricing">Выбрать план подписки</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
