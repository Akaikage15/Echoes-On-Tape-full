import { useState, useEffect, useMemo } from 'react';
import { useSessionStore } from '../lib/store';
import { fetchAllProLibraryItems } from '../lib/services';
import { BackendProLibraryItem } from '../types';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Lock, Download, Music, Video, Package, Code, Type } from 'lucide-react';
import { toast } from 'sonner';
import { Paywall } from '../components/Paywall';
import { useSubscription } from '../hooks/useSubscription';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface ProLibraryItemCardProps {
  item: BackendProLibraryItem;
}

function ProLibraryItemCard({ item }: ProLibraryItemCardProps) {
  const { hasAccess } = useSubscription();
  const accessGranted = hasAccess(item.required_tier);

  const icon = {
    'sample_pack': <Music className="h-10 w-10 text-primary/40" />,
    'preset_pack': <Code className="h-10 w-10 text-primary/40" />,
    'daw_project': <Video className="h-10 w-10 text-primary/40" />,
    'masterclass_video': <Video className="h-10 w-10 text-primary/40" />,
    'midi_pack': <Type className="h-10 w-10 text-primary/40" />,
  }[item.type];

  const typeLabel = {
    'sample_pack': 'Семпл-пак',
    'preset_pack': 'Пресет-пак',
    'daw_project': 'Проект DAW',
    'masterclass_video': 'Мастер-класс',
    'midi_pack': 'MIDI-пак',
  }[item.type];

  return (
    <div className="relative bg-card/80 backdrop-blur-md rounded-lg overflow-hidden transition-all hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1 flex flex-col">
      {/* Cover/Preview */}
      <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
        {item.preview_image_url ? (
          <img src={item.preview_image_url} alt={item.title} className="object-cover w-full h-full" />
        ) : (
          icon
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-xs text-muted-foreground">{typeLabel}</span>
          <h3 className="font-['Bebas_Neue'] text-xl tracking-wide line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </div>

        <div className="mt-4">
          {accessGranted ? (
            <a href={item.file_url} download className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary py-2 px-4 rounded-md">
              <Download className="h-4 w-4" />
              Скачать
            </a>
          ) : (
            <Paywall requiredTier={item.required_tier} />
          )}
        </div>
      </div>
    </div>
  );
}

export function ProLibraryPage() {
  const [proLibraryItems, setProLibraryItems] = useState<BackendProLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const loadProLibraryItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedItems = await fetchAllProLibraryItems();
        setProLibraryItems(fetchedItems);
      } catch (err: any) {
        setError('Не удалось загрузить материалы PRO-библиотеки. Попробуйте обновить страницу.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProLibraryItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (typeFilter === 'all') return proLibraryItems;
    return proLibraryItems.filter(item => item.type === typeFilter);
  }, [typeFilter, proLibraryItems]);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
            <Skeleton className="h-6 w-1/3 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-lg space-y-4">
                <Skeleton className="aspect-video w-full" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
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
        <div className="text-center mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            PRO-библиотека
          </h1>
          <p className="text-lg text-muted-foreground">
            Эксклюзивные семплы, пресеты, MIDI и проекты DAW для профессионалов.
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 bg-card/80 backdrop-blur-md p-6 rounded-lg relative z-10">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Тип материала</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="sample_pack">Семпл-паки</SelectItem>
                <SelectItem value="preset_pack">Пресет-паки</SelectItem>
                <SelectItem value="daw_project">Проекты DAW</SelectItem>
                <SelectItem value="masterclass_video">Мастер-классы</SelectItem>
                <SelectItem value="midi_pack">MIDI-паки</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pro Library Items */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <ProLibraryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="font-['Bebas_Neue'] text-3xl mb-4">
              Материалы не найдены
            </h3>
            <p className="text-muted-foreground">
              Попробуйте изменить фильтры или сбросить их.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}