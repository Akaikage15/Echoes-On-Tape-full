import { useState, useMemo, useEffect } from 'react';
import { ReleaseCard } from '../components/ReleaseCard';
import { Artist, Release, BackendArtist } from '../types';
import { fetchAllReleases, fetchAllArtists } from '../lib/services';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { useSessionStore } from '../lib/store';
import { toast } from 'sonner';

// Extend BackendRelease to include the joined artist object and frontend specific fields like 'year'
interface FrontendRelease extends Release {
  artist: BackendArtist; // Assuming backend joins artist data
  year: number; // Derived from release_date
}

export function ReleasesPage() {
  const [releases, setReleases] = useState<FrontendRelease[]>([]);
  const [artists, setArtists] = useState<BackendArtist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [artistFilter, setArtistFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const { currentUser } = useSessionStore();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [fetchedReleases, fetchedArtists] = await Promise.all([
          fetchAllReleases(),
          fetchAllArtists(),
        ]);

        const releasesWithArtistAndYear: FrontendRelease[] = fetchedReleases.map(release => {
          const artist = fetchedArtists.find(a => a.id === release.artist_id);
          if (!artist) {
            console.warn(`Artist not found for release ${release.title}`);
            // Provide a fallback artist to avoid breaking if artist_id is missing/invalid
            return {
              ...release,
              artist: { id: '', name: 'Unknown Artist', bio: '', photo_url: '', social_links: {}, created_at: '', updated_at: '' },
              year: new Date(release.release_date).getFullYear(),
            };
          }
          return {
            ...release,
            artist: artist,
            year: new Date(release.release_date).getFullYear(),
          };
        });
        
        setReleases(releasesWithArtistAndYear);
        setArtists(fetchedArtists);
        
      } catch (err: any) {
        setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
        toast.error('Не удалось загрузить данные релизов и артистов.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const years = useMemo(() => {
    const yearSet = new Set(releases.map(r => r.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [releases]);

  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      if (artistFilter !== 'all' && release.artist.id !== artistFilter) return false;
      if (yearFilter !== 'all' && release.year.toString() !== yearFilter) return false;
      if (typeFilter !== 'all' && release.type && release.type !== typeFilter) return false; // Assuming 'type' field will be added to backend release
      return true;
    });
  }, [releases, artistFilter, yearFilter, typeFilter]);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Каталог релизов
          </h1>
          <p className="text-lg text-muted-foreground">
            Все релизы лейбла Echoes On Tape на одной странице
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-card p-6 rounded-lg relative z-20">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Артист</label>
            <Select value={artistFilter} onValueChange={setArtistFilter}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Все артисты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все артисты</SelectItem>
                {artists.map(artist => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Год</label>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Все годы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все годы</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Тип</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="album">Альбом</SelectItem>
                <SelectItem value="ep">EP</SelectItem>
                <SelectItem value="single">Сингл</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[250px] w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
           <div className="text-center py-16">
            <p className="text-lg text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Повторить</Button>
          </div>
        ) : filteredReleases.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReleases.map(release => (
              <ReleaseCard key={release.id} release={release} showExclusiveBadge={!!currentUser} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Релизов не найдено</p>
            <p className="text-sm text-muted-foreground mt-2">
              Попробуйте изменить фильтры или сбросить их.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
