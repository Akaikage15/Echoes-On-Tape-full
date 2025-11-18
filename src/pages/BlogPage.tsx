import { useState, useMemo } from 'react';
import { BlogPostCard } from '../components/BlogPostCard';
import { blogPosts, currentUser } from '../lib/data';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

export function BlogPage() {
  const [filter, setFilter] = useState<'all' | 'exclusive'>('all');

  const filteredPosts = useMemo(() => {
    if (filter === 'exclusive') {
      return blogPosts.filter(post => post.isExclusive);
    }
    return blogPosts;
  }, [filter]);

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
          <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'exclusive')}>
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
