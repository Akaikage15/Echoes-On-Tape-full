import { useParams, Link } from 'react-router-dom';
import { Music, Download, Lock, Play, ExternalLink, Calendar, Disc } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { useEffect, useState } from 'react';
import { BackendRelease, BackendArtist, SubscriptionTier } from '../types';
import { fetchReleaseById } from '../lib/services';
import { useSessionStore } from '../lib/store';
import { toast } from 'sonner';

// Define a type for Release including the artist data from backend join
interface ReleaseDetail extends BackendRelease {
  artist: BackendArtist;
  // Frontend-specific fields if any
}

export function ReleaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [release, setRelease] = useState<ReleaseDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useSessionStore();

  useEffect(() => {
    if (!id) {
      setError('ID релиза не указан.');
      setLoading(false);
      return;
    }

    const loadRelease = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedRelease = await fetchReleaseById(id);
        // Assuming backend release object already includes the joined artist data
        setRelease(fetchedRelease as ReleaseDetail);
      } catch (err: any) {
        setError('Не удалось загрузить релиз. Возможно, он не существует.');
        toast.error('Не удалось загрузить релиз.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRelease();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="w-full aspect-square rounded-lg mb-4" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
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
          <Link to="/releases">
            <Button variant="outline">Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!release) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl">Релиз не найден</h1>
          <Link to="/releases">
            <Button variant="outline">Вернуться к каталогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Frontend-specific access logic (simplified for now)
  const hasAccess = currentUser && (
    !release.requiredTier ||
    (currentUser.subscriptionTier === 'pro') ||
    (currentUser.subscriptionTier === 'fan' && release.requiredTier !== 'pro') ||
    (currentUser.subscriptionTier === 'lite' && release.requiredTier === 'lite')
  );

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">
          {/* Cover */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-4">
                {release.cover_art_url ? (
                  <img src={release.cover_art_url} alt={release.title} className="object-cover w-full h-full" />
                ) : (
                  <Music className="h-48 w-48 text-primary/40 relative z-10" />
                )}
              </div>
              
              {/* External Links */}
              {(release.streaming_links?.yandexMusic || release.streaming_links?.youtube) && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-2">Слушать на:</p>
                  {release.streaming_links.yandexMusic && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(release.streaming_links.yandexMusic, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Яндекс.Музыка
                    </Button>
                  )}
                  {release.streaming_links.youtube && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(release.streaming_links.youtube, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      YouTube Music
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {/* Assuming 'type' will be part of BackendRelease in the future, or derive it */}
                {/* <Badge variant="outline">
                  {release.type === 'album' ? 'Альбом' : release.type === 'ep' ? 'EP' : 'Сингл'}
                </Badge> */}
                {/* Assuming 'genre' will be part of BackendRelease */}
                {/* <Badge variant="outline">{release.genre}</Badge> */}
              </div>
              
              <h1 className="font-['Bebas_Neue'] text-4xl md:text-6xl tracking-wide">
                {release.title}
              </h1>
              
              <Link to={`/artist/${release.artist.id}`}>
                <p className="text-xl text-primary hover:text-accent-secondary transition-colors">
                  {release.artist.name}
                </p>
              </Link>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(release.release_date).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                {/* Assuming tracklist info comes from backend */}
                {/* <span className="flex items-center gap-1">
                  <Disc className="h-4 w-4" />
                  {release.tracklist.length} {release.tracklist.length === 1 ? 'трек' : 'треков'}
                </span> */}
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground">{release.description}</p>
            </div>

            {/* Tracklist - Currently not part of backend Release object from releases-db.ts */}
            {/* <div className="space-y-4">
              <h3 className="font-['Bebas_Neue'] text-2xl">Треклист</h3>
              <div className="space-y-2">
                {release.tracklist.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      track.exclusive
                        ? hasAccess
                          ? 'bg-primary/5 hover:bg-primary/10'
                          : 'bg-secondary/50'
                        : 'bg-card hover:bg-card/80'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-sm text-muted-foreground w-6">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className={track.exclusive && !hasAccess ? 'text-muted-foreground' : ''}>
                          {track.title}
                        </p>
                        {track.exclusive && (
                          <div className="flex items-center gap-2 mt-1">
                            <Lock className="h-3 w-3 text-primary" />
                            <span className="text-xs text-primary">
                              {track.requiredTier === 'pro' ? 'Pro' : track.requiredTier === 'fan' ? 'Fan' : 'Lite'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {track.duration}
                      </span>
                      {track.exclusive && hasAccess && (
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* Exclusive Content Section - Also depends on tracklist */}
            {/* {release.hasExclusive && (
              <div className="p-6 rounded-lg bg-gradient-to-br from-primary/10 to-card border border-primary/20">
                <div className="flex items-start gap-4">
                  <Lock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1 space-y-3">
                    <h3 className="font-['Bebas_Neue'] text-2xl">
                      Эксклюзивный контент
                    </h3>
                    {hasAccess ? (
                      <>
                        <p className="text-muted-foreground">
                          Вам доступны {release.tracklist.filter(t => t.exclusive && 
                            (!t.requiredTier || 
                            (currentUser?.subscription === 'pro') ||
                            (currentUser?.subscription === 'fan' && t.requiredTier !== 'pro') ||
                            (currentUser?.subscription === 'lite' && t.requiredTier === 'lite'))
                          ).length} эксклюзивных трека из этого релиза
                        </p>
                        <div className="flex gap-2">
                          <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary">
                            <Play className="h-4 w-4" />
                            Слушать эксклюзивы
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Скачать
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground">
                          Этот релиз содержит {release.tracklist.filter(t => t.exclusive).length} эксклюзивных трека, 
                          доступных только подписчикам
                        </p>
                        <Link to="/pricing">
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                            Оформить подписку
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>

        {/* Similar Releases - Removed for now */}
      </div>
    </div>
  );
}
