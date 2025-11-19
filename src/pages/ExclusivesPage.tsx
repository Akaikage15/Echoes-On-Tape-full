import { useState, useMemo } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Paywall } from '../components/Paywall';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Lock, Music, Video, Package } from 'lucide-react';
import { Button } from '../components/ui/button';

interface ExclusiveItem {
  id: string;
  title: string;
  type: 'track' | 'video' | 'sample_pack' | 'other';
  requiredTier: 'lite' | 'fan' | 'pro';
  description: string;
}

const mockExclusiveContent: ExclusiveItem[] = [
  {
    id: '1',
    title: 'Эксклюзивный трек "Neon Dreams"',
    type: 'track',
    requiredTier: 'lite',
    description: 'Ранний доступ к новому треку от LXST MXRCRY. Доступно в высоком качестве.',
  },
  {
    id: '2',
    title: 'Backstage видео со съемок клипа "Cyberpunk City"',
    type: 'video',
    requiredTier: 'fan',
    description: 'Погрузитесь в процесс создания нашего последнего клипа. Только для фанатов!',
  },
  {
    id: '3',
    title: 'Семпл-пак "Vintage Synths Vol. 1"',
    type: 'sample_pack',
    requiredTier: 'pro',
    description: 'Коллекция уникальных звуков винтажных синтезаторов, записанных в нашей студии.',
  },
  {
    id: '4',
    title: 'Дневник разработчика "Создание LXV3 DRXWN"',
    type: 'other',
    requiredTier: 'lite',
    description: 'Инсайты о процессе написания музыки и создания образов.',
  },
  {
    id: '5',
    title: 'Мастер-класс по микшированию (урок 1)',
    type: 'video',
    requiredTier: 'pro',
    description: 'Подробный мастер-класс по сведению и мастерингу треков.',
  },
];

function ExclusiveContentItem({ item }: { item: ExclusiveItem }) {
  const { hasAccess } = useSubscription();

  if (!hasAccess(item.requiredTier)) {
    return <Paywall requiredTier={item.requiredTier} />;
  }

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
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-foreground">Требуемая подписка: {item.requiredTier.toUpperCase()}</span>
        {/* Здесь могут быть кнопки "Слушать", "Скачать", "Смотреть" */}
        <Button size="sm">
          {item.type === 'track' && 'Слушать'}
          {item.type === 'video' && 'Смотреть'}
          {item.type === 'sample_pack' && 'Скачать'}
          {item.type === 'other' && 'Подробнее'}
        </Button>
      </div>
    </div>
  );
}

export function ExclusivesPage() {
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');

  const filteredContent = useMemo(() => {
    return mockExclusiveContent.filter(item => {
      const matchesType = contentTypeFilter === 'all' || item.type === contentTypeFilter;
      const matchesTier = tierFilter === 'all' || item.requiredTier === tierFilter;
      return matchesType && matchesTier;
    });
  }, [contentTypeFilter, tierFilter]);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto relative z-10"> {/* Added relative z-10 for content over particles */}
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