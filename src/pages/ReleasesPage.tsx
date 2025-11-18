import { useState, useMemo, useEffect } from 'react';
import { ReleaseCard } from '../components/ReleaseCard';
import { artists, Release } from '../lib/data'; // Keep artists for filters for now
import apiClient from '../lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { currentUser } from '../lib/data';

export function ReleasesPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [artistFilter, setArtistFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        setLoading(true);
        // NOTE: This will currently fail with 501, which is expected.
        // We are building the frontend structure first.
        const response = await apiClient.get('/releases');
        setReleases(response.data);
        setError(null);
      } catch (err) {
        setError('Не удалось загрузить релизы. Сервер пока не реализован.');
        // Set empty array to show the "not found" message as a fallback
        setReleases([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, []);

  const years = useMemo(() => {
    const yearSet = new Set(releases.map(r => r.year));
    return Array.from(yearSet).sort((a, b) => b - a);
  }, [releases]);

  const filteredReleases = useMemo(() => {
    return releases.filter(release => {
      if (artistFilter !== 'all' && release.artistId !== artistFilter) return false;
      if (yearFilter !== 'all' && release.year.toString() !== yearFilter) return false;
      if (typeFilter !== 'all' && release.type !== typeFilter) return false;
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-card p-6 rounded-lg">
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
