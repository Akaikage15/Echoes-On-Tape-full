import { useState, useMemo, useEffect } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Paywall } from '../components/Paywall';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Lock, Music, Video, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AudioPlayer } from '../components/AudioPlayer';
import { ExclusiveContent } from '../types'; // Imported ExclusiveContent
import { fetchAllExclusives } from '../lib/services'; // Imported fetchAllExclusives
import { Skeleton } from '../components/ui/skeleton';

function ExclusiveContentItem({ item }: { item: ExclusiveContent }) {
  const { hasAccess } = useSubscription();

  const accessGranted = hasAccess(item.required_tier || 'none');

  const icon = {
    'track': <Music className="h-6 w-6 text-primary" />,
    'video': <Video className="h-6 w-6 text-primary" />,
    'sample_pack': <Package className="h-6 w-6 text-primary" />,
    'other': <Lock className="h-6 w-6 text-primary" />,
  }[item.type];

  return (
    <div className="bg-card/80 backdrop-blur-md p-6 rounded-lg space-y-3 relative z-10">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-['Bebas_Neue'] text-2xl text-primary tracking-wide">{item.title}</h3>
      </div>
      <p className="text-muted-foreground">{item.description}</p>
      
      {accessGranted ? (
        item.type === 'track' && item.file_url ? (
          <AudioPlayer src={item.file_url} title={item.title} artist="LXST MXRCRY" artwork={item.preview_image_url} />
        ) : item.type === 'video' && item.file_url ? (
          <video controls src={item.file_url} className="w-full rounded-md mt-4" poster={item.preview_image_url} />
        ) : item.type === 'sample_pack' && item.file_url ? (
          <div className="mt-4">
            <a href={item.file_url} download className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent-secondary transition-colors">
              <Package className="h-4 w-4 mr-2" /> Скачать семпл-пак
            </a>
          </div>
        ) : (
          <div className="mt-4">
            <Button size="sm">Подробнее</Button>
          </div>
        )
      ) : (
        <Paywall requiredTier={item.required_tier || 'none'} />
      )}
    </div>
  );
}

export function ExclusivesPage() {
  const [exclusives, setExclusives] = useState<ExclusiveContent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  useEffect(() => {
    const loadExclusives = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedExclusives = await fetchAllExclusives();
        setExclusives(fetchedExclusives);
      } catch (err: any) {
        setError('Не удалось загрузить эксклюзивный контент. Попробуйте обновить страницу.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadExclusives();
  }, []);

  const filteredContent = useMemo(() => {
    return exclusives.filter(item => {
      const matchesType = contentTypeFilter === 'all' || item.type === contentTypeFilter;
      const matchesTier = tierFilter === 'all' || (item.required_tier && item.required_tier === tierFilter);
      return matchesType && matchesTier;
    });
  }, [contentTypeFilter, tierFilter, exclusives]);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-2/3 mb-4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-card/80 backdrop-blur-md p-6 rounded-lg relative z-10">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card/80 backdrop-blur-md p-6 rounded-lg space-y-3 relative z-10">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl text-destructive">{error}</h1>
          <Button onClick={() => window.location.reload()} className="mt-4">Повторить</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
              Эксклюзивы
            </h1>
            <p className="text-lg text-muted-foreground">
              Контент, доступный только для наших подписчиков.
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 bg-card/80 backdrop-blur-md p-6 rounded-lg relative z-10">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Тип контента</label>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Все типы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  <SelectItem value="track">Треки</SelectItem>
                  <SelectItem value="video">Видео</SelectItem>
                  <SelectItem value="sample_pack">Семпл-паки</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Уровень подписки</label>
              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Все уровни" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все уровни</SelectItem>
                  <SelectItem value="lite">Lite+</SelectItem>
                  <SelectItem value="fan">Fan+</SelectItem>
                  <SelectItem value="pro">Pro+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Exclusive Content List */}
          <div className="space-y-8">
            {filteredContent.length > 0 ? (
              filteredContent.map(item => (
                <ExclusiveContentItem key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Контент не найден по выбранным фильтрам.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}