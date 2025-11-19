import { useParams, Link } from 'react-router-dom';
import { User, Send, Instagram, ExternalLink, Lock, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ReleaseCard } from '../components/ReleaseCard';
import { useEffect, useState } from 'react';
import { BackendArtist, BackendRelease } from '../types';
import { fetchArtistById, fetchAllReleases } from '../lib/services';
import { useSessionStore } from '../lib/store';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<BackendArtist | null>(null);
  const [artistReleases, setArtistReleases] = useState<BackendRelease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useSessionStore();

  useEffect(() => {
    if (!id) {
      setError('ID артиста не указан.');
      setLoading(false);
      return;
    }

    const loadArtistAndReleases = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedArtist, allReleases] = await Promise.all([
          fetchArtistById(id),
          fetchAllReleases(),
        ]);
        setArtist(fetchedArtist);
        setArtistReleases(allReleases.filter(release => release.artist_id === fetchedArtist.id));
      } catch (err: any) {
        setError('Не удалось загрузить данные артиста или релизы. Возможно, артист не существует.');
        toast.error('Не удалось загрузить данные артиста.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArtistAndReleases();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Skeleton className="w-full aspect-square rounded-lg mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
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
          <Link to="/artists">
            <Button variant="outline">Вернуться к артистам</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl">Артист не найден</h1>
          <Link to="/artists">
            <Button variant="outline">Вернуться к артистам</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Avatar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-4 ring-2 ring-primary">
                {artist.photo_url ? (
                  <img src={artist.photo_url} alt={artist.name} className="object-cover w-full h-full" />
                ) : (
                  <User className="h-48 w-48 text-primary/30 relative z-10" />
                )}
              </div>
              
              {/* Social Links */}
              {(Object.keys(artist.social_links || {}).length > 0) && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Соцсети артиста:</p>
                  {artist.social_links.telegram && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.social_links.telegram, '_blank')}
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </Button>
                  )}
                  {artist.social_links.instagram && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.social_links.instagram, '_blank')}
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Button>
                  )}
                  {artist.social_links.vk && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.social_links.vk, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      VK
                    </Button>
                  )}
                  {artist.social_links.website && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.social_links.website, '_blank')}
                    >
                      <Globe className="h-4 w-4" />
                      Website
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="font-['Bebas_Neue'] text-5xl md:text-7xl tracking-wide mb-3">
                {artist.name}
              </h1>
              {/* Genre is not in backend BackendArtist currently */}
              {/* <p className="text-xl text-primary">{artist.genre}</p> */}
            </div>

            <div className="prose prose-invert max-w-none">
              <h3 className="font-['Bebas_Neue'] text-2xl mb-3">Биография</h3>
              <p className="text-muted-foreground leading-relaxed">{artist.bio}</p>
            </div>

            {/* Exclusive Content Teaser */}
            {!currentUser && (
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-card border border-primary/20">
                <div className="flex items-start gap-4">
                  <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-3">
                    <h3 className="font-['Bebas_Neue'] text-2xl">
                      Эксклюзивный контент
                    </h3>
                    <p className="text-muted-foreground">
                      Подписчики получают доступ к эксклюзивным трекам, backstage-видео 
                      и другим материалам от {artist.name}
                    </p>
                    <Link to="/pricing">
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                        Оформить подписку
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Releases */}
        {artistReleases.length > 0 && (
          <div>
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide mb-6">
              Релизы артиста
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artistReleases.map(release => (
                <ReleaseCard key={release.id} release={release} showExclusiveBadge={!!currentUser} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
