import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Video, Package, Disc, Lock, Download, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { exclusiveContent, currentUser, ExclusiveContent } from '../lib/data';

export function ExclusivesPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/pricing');
    return null;
  }

  // Redirect if no subscription
  if (!currentUser.subscription) {
    navigate('/pricing');
    return null;
  }

  const filteredContent = useMemo(() => {
    return exclusiveContent.filter(item => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false;
      return true;
    });
  }, [typeFilter]);

  const canAccess = (item: ExclusiveContent) => {
    if (!currentUser || !currentUser.subscription) return false;
    if (currentUser.subscription === 'pro') return true;
    if (currentUser.subscription === 'fan' && item.requiredTier !== 'pro') return true;
    if (currentUser.subscription === 'lite' && item.requiredTier === 'lite') return true;
    return false;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'track': return Music;
      case 'video': return Video;
      case 'sample': return Package;
      case 'preset': return Disc;
      default: return Music;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'track': return 'Трек';
      case 'video': return 'Видео';
      case 'sample': return 'Сэмплы';
      case 'preset': return 'Пресеты';
      default: return type;
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'lite': return 'Lite';
      case 'fan': return 'Fan';
      case 'pro': return 'Pro';
      default: return tier;
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Эксклюзивный контент
          </h1>
          <p className="text-lg text-muted-foreground">
            Библиотека эксклюзивных материалов для подписчиков
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="track">Треки</TabsTrigger>
              <TabsTrigger value="video">Видео</TabsTrigger>
              <TabsTrigger value="sample">Сэмплы</TabsTrigger>
              <TabsTrigger value="preset">Пресеты</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map(item => {
              const Icon = getIcon(item.type);
              const hasAccess = canAccess(item);

              return (
                <div
                  key={item.id}
                  className={`overflow-hidden rounded-lg bg-card transition-all duration-250 ${
                    hasAccess 
                      ? 'hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1' 
                      : 'opacity-60'
                  }`}
                >
                  {/* Cover */}
                  <div className="aspect-square bg-secondary flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
                    <Icon className="h-20 w-20 text-primary/40 relative z-10" />
                    
                    {/* Tier Badge */}
                    <div className="absolute top-2 right-2 z-20">
                      <Badge 
                        className={hasAccess 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-muted-foreground'
                        }
                      >
                        {getTierLabel(item.requiredTier)}
                      </Badge>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 z-20">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>

                    {/* Lock Overlay */}
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-30">
                        <Lock className="h-12 w-12 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-['Bebas_Neue'] text-xl tracking-wide line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.releaseDate).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>

                    {/* Actions */}
                    {hasAccess ? (
                      <div className="flex gap-2">
                        {item.streamUrl && (
                          <Button size="sm" className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary">
                            <Play className="h-4 w-4" />
                            {item.type === 'video' ? 'Смотреть' : 'Слушать'}
                          </Button>
                        )}
                        {item.downloadUrl && (
                          <Button size="sm" variant="outline" className="flex-1 gap-2">
                            <Download className="h-4 w-4" />
                            Скачать
                          </Button>
                        )}
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => navigate('/pricing')}
                      >
                        <Lock className="h-4 w-4" />
                        Доступно для {getTierLabel(item.requiredTier)}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Пока нет эксклюзивов в этой категории
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
