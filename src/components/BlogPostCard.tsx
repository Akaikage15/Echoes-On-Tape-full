import { Link } from 'react-router-dom';
import { FileText, Lock } from 'lucide-react';
import { Badge } from './ui/badge';
import { BlogPost } from '../types';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const excerpt = post.content.substring(0, 100) + '...';

  return (
    <Link to={`/blog/${post.id}`} className="group block">
      <div className="overflow-hidden rounded-md bg-card/80 backdrop-blur-md transition-all duration-250 hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1">
        {/* Cover Image */}
        <div className="aspect-video bg-secondary flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
          <FileText className="h-16 w-16 text-primary/40 relative z-10" />
          
          {/* Exclusive Badge */}
          {!post.is_public && (
            <div className="absolute top-2 right-2 z-20">
              <Badge className="bg-primary text-primary-foreground gap-1">
                <Lock className="h-3 w-3" />
                Для подписчиков
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <div className="text-xs text-muted-foreground">
            {formatDate(post.created_at)}
          </div>
          <h3 className="font-['Bebas_Neue'] text-xl tracking-wide group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}
