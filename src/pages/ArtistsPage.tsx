import { useState, useEffect } from 'react';
import { ArtistCard } from '../components/ArtistCard';
import { fetchAllArtists } from '../lib/services';
import { BackendArtist } from '../types';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function ArtistsPage() {
  const [artists, setArtists] = useState<BackendArtist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtists = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedArtists = await fetchAllArtists();
        setArtists(fetchedArtists);
      } catch (err: any) {
        setError('Не удалось загрузить артистов. Попробуйте обновить страницу.');
        toast.error('Не удалось загрузить артистов.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
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
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Артисты лейбла
          </h1>
          <p className="text-lg text-muted-foreground">
            Познакомьтесь с музыкантами Echoes On Tape
          </p>
        </div>

        {/* Artists Grid */}
        {artists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Артисты не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
