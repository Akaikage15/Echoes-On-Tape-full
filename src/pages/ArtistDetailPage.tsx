import { useParams, Link } from 'react-router-dom';
import { User, Send, Instagram, ExternalLink, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ReleaseCard } from '../components/ReleaseCard';
import { artists, releases, currentUser } from '../lib/data';

export function ArtistDetailPage() {
  const { id } = useParams();
  const artist = artists.find(a => a.id === id);

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

  const artistReleases = releases.filter(r => r.artistId === id);

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Avatar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-4 ring-2 ring-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary" />
                <User className="h-48 w-48 text-primary/30 relative z-10" />
              </div>
              
              {/* Social Links */}
              {(artist.socials.telegram || artist.socials.instagram || artist.socials.vk) && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">Соцсети артиста:</p>
                  {artist.socials.telegram && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.socials.telegram, '_blank')}
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </Button>
                  )}
                  {artist.socials.instagram && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.socials.instagram, '_blank')}
                    >
                      <Instagram className="h-4 w-4" />
                      Instagram
                    </Button>
                  )}
                  {artist.socials.vk && (
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => window.open(artist.socials.vk, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      VK
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
              <p className="text-xl text-primary">{artist.genre}</p>
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
