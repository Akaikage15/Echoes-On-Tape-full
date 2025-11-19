import { useState, useMemo } from 'react';
import { useSubscription } from '../hooks/useSubscription';
import { Paywall } from '../components/Paywall';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Lock, Music, Video, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { AudioPlayer } from '../components/AudioPlayer';

interface ExclusiveItem {
  id: string;
  title: string;
  type: 'track' | 'video' | 'sample_pack' | 'other';
  requiredTier: 'lite' | 'fan' | 'pro';
  description: string;
  src?: string; // Add optional source for audio/video
  artwork?: string; // Optional artwork
}

const mockExclusiveContent: ExclusiveItem[] = [
  {
    id: '1',
    title: 'Эксклюзивный трек "Neon Dreams"',
    type: 'track',
    requiredTier: 'lite',
    description: 'Ранний доступ к новому треку от LXST MXRCRY. Доступно в высоком качестве.',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio source
    artwork: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Track',
  },
  {
    id: '2',
    title: 'Backstage видео со съемок клипа "Cyberpunk City"',
    type: 'video',
    requiredTier: 'fan',
    description: 'Погрузитесь в процесс создания нашего последнего клипа. Только для фанатов!',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder video source
    artwork: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=Video',
  },
  {
    id: '3',
    title: 'Семпл-пак "Vintage Synths Vol. 1"',
    type: 'sample_pack',
    requiredTier: 'pro',
    description: 'Коллекция уникальных звуков винтажных синтезаторов, записанных в нашей студии.',
    src: 'https://example.com/sample_pack.zip', // Placeholder download link
    artwork: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Samples',
  },
  {
    id: '4',
    title: 'Дневник разработчика "Создание LXV3 DRXWN"',
    type: 'other',
    requiredTier: 'lite',
    description: 'Инсайты о процессе написания музыки и создания образов.',
    artwork: 'https://via.placeholder.com/150/C0B6F2/FFFFFF?text=DevLog',
  },
  {
    id: '5',
    title: 'Мастер-класс по микшированию (урок 1)',
    type: 'video',
    requiredTier: 'pro',
    description: 'Подробный мастер-класс по сведению и мастерингу треков.',
    src: 'https://www.w3schools.com/html/mov_bbb.mp4', // Another placeholder video source
    artwork: 'https://via.placeholder.com/150/B19CD9/FFFFFF?text=Masterclass',
  },
];

function ExclusiveContentItem({ item }: { item: ExclusiveItem }) {
  const { hasAccess } = useSubscription();

  const accessGranted = hasAccess(item.requiredTier);

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
        item.type === 'track' && item.src ? (
          <AudioPlayer src={item.src} title={item.title} artist="LXST MXRCRY" artwork={item.artwork} />
        ) : item.type === 'video' && item.src ? (
          <video controls src={item.src} className="w-full rounded-md mt-4" poster={item.artwork} />
        ) : item.type === 'sample_pack' && item.src ? (
          <div className="mt-4">
            <a href={item.src} download className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent-secondary transition-colors">
              <Package className="h-4 w-4 mr-2" /> Скачать семпл-пак
            </a>
          </div>
        ) : (
          <div className="mt-4">
            <Button size="sm">Подробнее</Button>
          </div>
        )
      ) : (
        <Paywall requiredTier={item.requiredTier} />
      )}
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