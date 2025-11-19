import { useParams, Link } from 'react-router-dom';
import { FileText, Lock, Calendar, User as UserIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useEffect, useState } from 'react';
import { BackendPost, SubscriptionTier } from '../types';
import { fetchPostById } from '../lib/services';
import { useSessionStore } from '../lib/store';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BackendPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { currentUser } = useSessionStore();

  useEffect(() => {
    if (!id) {
      setError('ID поста не указан.');
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPost = await fetchPostById(id);
        setPost(fetchedPost);
      } catch (err: any) {
        setError('Не удалось загрузить пост. Возможно, он не существует.');
        toast.error('Не удалось загрузить пост.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <Skeleton className="w-full aspect-video rounded-lg mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl text-destructive">Failed to edit, 0 occurrences found for old_string (import { useParams, Link } from 'react-router-dom';
import { FileText, Lock, Calendar, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { BlogPostCard } from '../components/BlogPostCard';
import { blogPosts, currentUser } from '../lib/data';

export function BlogPostPage() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl">Пост не найден</h1>
          <Link to="/blog">
            <Button variant="outline">Вернуться к блогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess = !post.isExclusive || (currentUser && (
    !post.requiredTier ||
    (currentUser.subscription === 'pro') ||
    (currentUser.subscription === 'fan' && post.requiredTier !== 'pro') ||
    (currentUser.subscription === 'lite')
  ));

  const otherPosts = blogPosts.filter(p => p.id !== id).slice(0, 2);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {post.isExclusive && (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Lock className="h-3 w-3" />
                  Для подписчиков
                </Badge>
              )}
            </div>

            <h1 className="font-['Bebas_Neue'] text-4xl md:text-6xl tracking-wide mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>
          </div>

          {/* Cover Image */}
          <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
            <FileText className="h-24 w-24 text-primary/40 relative z-10" />
          </div>

          {/* Content */}
          {hasAccess ? (
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {post.content}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>

              {/* Paywall */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
                <div className="blur-sm select-none pointer-events-none">
                  <p className="text-muted-foreground">
                    Этот контент доступен только для подписчиков. 
                    Эксклюзивные материалы от артистов лейбла помогают нам создавать больше качественной музыки...
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-lg bg-gradient-to-br from-primary/10 to-card border border-primary/20 text-center">
                <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-['Bebas_Neue'] text-3xl mb-3">
                  Этот пост для подписчиков
                </h3>
                <p className="text-muted-foreground mb-6">
                  Оформите подписку {post.requiredTier === 'pro' ? 'Pro' : post.requiredTier === 'fan' ? 'Fan' : 'Lite'} 
                  {' '}для доступа к эксклюзивному контенту
                </p>
                <Link to="/pricing">
                  <Button className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                    Оформите подписку
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Other Posts */}
          {otherPosts.length > 0 && (
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="font-['Bebas_Neue'] text-3xl tracking-wide mb-6">
                Другие посты
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {otherPosts.map(p => (
                  <BlogPostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}</h1>
          <Link to="/blog">
            <Button variant="outline">Вернуться к блогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Bebas_Neue'] text-4xl">Пост не найден</h1>
          <Link to="/blog">
            <Button variant="outline">Вернуться к блогу</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasAccess = post.is_public || (currentUser && (
    !post.min_tier ||
    (currentUser.subscriptionTier === 'pro') ||
    (currentUser.subscriptionTier === 'fan' && post.min_tier !== 'pro') ||
    (currentUser.subscriptionTier === 'lite' && post.min_tier === 'lite')
  ));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {!post.is_public && (
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Lock className="h-3 w-3" />
                  Для подписчиков
                </Badge>
              )}
            </div>

            <h1 className="font-['Bebas_Neue'] text-4xl md:text-6xl tracking-wide mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.created_at)}
              </span>
              {/* Assuming author name can be fetched or derived */}
              {/* <span className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                {post.author_id}
              </span> */}
            </div>
          </div>

          {/* Cover Image */}
          <div className="aspect-video rounded-lg bg-secondary flex items-center justify-center overflow-hidden mb-8">
            {post.cover_image_url ? (
              <img src={post.cover_image_url} alt={post.title} className="object-cover w-full h-full" />
            ) : (
              <FileText className="h-24 w-24 text-primary/40 relative z-10" />
            )}
          </div>

          {/* Content */}
          {hasAccess ? (
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                {post.content}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview - if any, otherwise blur full content */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
                <div className="blur-sm select-none pointer-events-none">
                  <p className="text-muted-foreground">
                    {post.content}
                  </p>
                </div>
              </div>

              <div className="p-8 rounded-lg bg-gradient-to-br from-primary/10 to-card border border-primary/20 text-center">
                <Lock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-['Bebas_Neue'] text-3xl mb-3">
                  Этот пост для подписчиков
                </h3>
                <p className="text-muted-foreground mb-6">
                  Оформите подписку {post.min_tier ? (post.min_tier === 'pro' ? 'Pro' : post.min_tier === 'fan' ? 'Fan' : 'Lite') : ''} 
                  {' '}для доступа к эксклюзивному контенту
                </p>
                <Link to="/pricing">
                  <Button className="bg-primary text-primary-foreground hover:bg-accent-secondary">
                    Оформить подписку
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Other Posts - Removed for now */}
        </div>
      </div>
    </div>
  );
}
