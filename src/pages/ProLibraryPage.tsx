import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Disc, Music, Video, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { proLibrary, currentUser } from '../lib/data';

export function ProLibraryPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  if (!currentUser || currentUser.subscription !== 'pro') {
    navigate('/pricing');
    return null;
  }

  const filteredItems = useMemo(() => {
    if (typeFilter === 'all') return proLibrary;
    return proLibrary.filter(item => item.type === typeFilter);
  }, [typeFilter]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'sample': return Package;
      case 'preset': return Disc;
      case 'midi': return Music;
      case 'tutorial': return Video;
      default: return Package;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'sample': return 'Сэмплы';
      case 'preset': return 'Пресеты';
      case 'midi': return 'MIDI';
      case 'tutorial': return 'Туториал';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide">
              PRO-библиотека
            </h1>
            <Badge className="bg-primary text-primary-foreground">Pro</Badge>
          </div>
          <p className="text-lg text-muted-foreground">
            Эксклюзивные материалы для музыкантов и продюсеров
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <Tabs value={typeFilter} onValueChange={setTypeFilter}>
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="sample">Сэмплы</TabsTrigger>
              <TabsTrigger value="preset">Пресеты</TabsTrigger>
              <TabsTrigger value="midi">MIDI</TabsTrigger>
              <TabsTrigger value="tutorial">Туториалы</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
              const Icon = getIcon(item.type);

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-lg overflow-hidden transition-all hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1"
                >
                  {/* Cover */}
                  <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
                    <Icon className="h-16 w-16 text-primary/40 relative z-10" />
                    
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2 z-20">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {getTypeLabel(item.type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-['Bebas_Neue'] text-xl tracking-wide line-clamp-2 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-primary">{item.artist}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.format}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {new Date(item.releaseDate).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>

                    <Button
                      className="w-full gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary"
                      onClick={() => alert('Скачивание началось!')}
                    >
                      <Download className="h-4 w-4" />
                      Скачать
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              Скоро появятся новые материалы
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
