import { useState, useMemo, useEffect } from 'react';
import { BlogPostCard } from '../components/BlogPostCard';
import { BackendPost, SubscriptionTier } from '../types';
import { fetchAllPosts } from '../lib/services';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { useSessionStore } from '../lib/store';
import { toast } from 'sonner';

export function BlogPage() {
  const [posts, setPosts] = useState<BackendPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'exclusive'>('all');

  const { currentUser } = useSessionStore();

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await fetchAllPosts();
        setPosts(fetchedPosts);
      } catch (err: any) {
        setError('Не удалось загрузить посты. Попробуйте обновить страницу.');
        toast.error('Не удалось загрузить посты.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!posts.length) return [];

    const publicPosts = posts.filter(post => post.is_public);
    const allExclusivePosts = posts.filter(post => !post.is_public);

    if (filter === 'exclusive') {
      // Показываем ВСЕ эксклюзивные посты (даже если нет доступа)
      // BlogPostCard сам покажет paywall для недоступных
      return allExclusivePosts;
    } else { // filter === 'all'
      // Показываем все публичные + все эксклюзивные посты
      return [...publicPosts, ...allExclusivePosts];
    }
  }, [filter, posts]);


  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'exclusive') {
      setFilter(value as 'all' | 'exclusive');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <Skeleton className="h-10 w-2/3 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
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
            Новости и блог
          </h1>
          <p className="text-lg text-muted-foreground">
            Следите за новостями лейбла и читайте эксклюзивные материалы от артистов
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <Tabs value={filter} onValueChange={handleFilterChange}>
            <TabsList>
              <TabsTrigger value="all">Все посты</TabsTrigger>
              <TabsTrigger value="exclusive">Только для подписчиков</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Постов не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
