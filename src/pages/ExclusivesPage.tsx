import { useSubscription } from '../hooks/useSubscription';
import { Paywall } from '../components/Paywall';

function ExclusiveContent({ title, requiredTier }: { title: string, requiredTier: 'lite' | 'fan' | 'pro' }) {
  const { hasAccess } = useSubscription();

  if (!hasAccess(requiredTier)) {
    return <Paywall requiredTier={requiredTier} />;
  }

  return (
    <div className="bg-card p-6 rounded-lg">
      <h3 className="font-['Bebas_Neue'] text-2xl text-primary">{title}</h3>
      <p className="mt-2">Вы видите этот эксклюзивный контент, потому что у вас есть подписка.</p>
    </div>
  );
}

export function ExclusivesPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
              Эксклюзивы
            </h1>
            <p className="text-lg text-muted-foreground">
              Контент, доступный только для наших подписчиков.
            </p>
          </div>

          <div className="space-y-8">
            <ExclusiveContent title="Эксклюзивный трек (Lite+)" requiredTier="lite" />
            <ExclusiveContent title="Backstage видео (Fan+)" requiredTier="fan" />
            <ExclusiveContent title="Семпл-пак от артиста (Pro+)" requiredTier="pro" />
          </div>
        </div>
      </div>
    </div>
  );
}