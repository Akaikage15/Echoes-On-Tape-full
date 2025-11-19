import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Sparkles, Headphones, Users, Lock, TrendingUp, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { ReleaseCard } from '../components/ReleaseCard';
import { ArtistCard } from '../components/ArtistCard';
import { BlogPostCard } from '../components/BlogPostCard';
import { fetchAllReleases, fetchAllArtists, fetchAllPosts } from '../lib/services';
import { BackendRelease, BackendArtist, BackendPost } from '../types';

export function HomePage() {
  const [releases, setReleases] = useState<BackendRelease[]>([]);
  const [artists, setArtists] = useState<BackendArtist[]>([]);
  const [blogPosts, setBlogPosts] = useState<BackendPost[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [releasesData, artistsData, postsData] = await Promise.all([
          fetchAllReleases(),
          fetchAllArtists(),
          fetchAllPosts(),
        ]);
        setReleases(releasesData);
        setArtists(artistsData);
        setBlogPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Optionally, set some error state here to show in the UI
      }
    };

    fetchData();
  }, []);

  const latestReleases = releases.slice(0, 3);
  const featuredArtists = artists.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-7xl tracking-wide">
              Музыка, которая живет за пределами стриминга
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Эксклюзивные релизы, прямая связь с артистами и комьюнити для тех, 
              кто ценит музыку больше алгоритмов
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/pricing">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent-secondary w-full sm:w-auto">
                  Стать подписчиком
                </Button>
              </Link>
              <Link to="/releases">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Посмотреть релизы
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Releases */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide">
              Последние релизы
            </h2>
            <Link to="/releases">
              <Button variant="ghost" className="text-primary hover:text-accent-secondary">
                Все релизы →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestReleases.map((release) => (
              <ReleaseCard key={release.id} release={release} showExclusiveBadge />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide text-center mb-12">
            Преимущества подписки
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 transition-all hover:bg-card hover:shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-['Bebas_Neue'] text-2xl">
                Эксклюзивный контент
              </h3>
              <p className="text-muted-foreground">
                Треки, миксы и материалы, недоступные на обычных стриминговых платформах
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 transition-all hover:bg-card hover:shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-['Bebas_Neue'] text-2xl">
                Ранний доступ
              </h3>
              <p className="text-muted-foreground">
                Слушайте новые релизы до официальной публикации на всех платформах
              </p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-lg bg-card/50 transition-all hover:bg-card hover:shadow-md">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-['Bebas_Neue'] text-2xl">
                Комьюнити
              </h3>
              <p className="text-muted-foreground">
                Прямое общение с артистами, голосования и влияние на жизнь лейбла
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide">
              Артисты лейбла
            </h2>
            <Link to="/artists">
              <Button variant="ghost" className="text-primary hover:text-accent-secondary">
                Все артисты →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-['Bebas_Neue'] text-4xl tracking-wide">
              Новости и блог
            </h2>
            <Link to="/blog">
              <Button variant="ghost" className="text-primary hover:text-accent-secondary">
                Все новости →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="font-['Bebas_Neue'] text-4xl md:text-5xl tracking-wide">
              Готовы присоединиться?
            </h2>
            <p className="text-lg text-muted-foreground">
              Выберите подписку и получите доступ к эксклюзивному контенту, 
              комьюнити и прямой связи с артистами лейбла
            </p>
            <Link to="/pricing">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                Выбрать тариф
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
