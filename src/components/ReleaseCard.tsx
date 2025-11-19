import { Link } from 'react-router-dom';
import { Music, Lock } from 'lucide-react';
import { Badge } from './ui/badge';
import { Release } from '../types';

interface ReleaseCardProps {
  release: Release;
  showExclusiveBadge?: boolean;
}

export function ReleaseCard({ release, showExclusiveBadge = false }: ReleaseCardProps) {
  return (
    <Link to={`/release/${release.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-card/80 backdrop-blur-md transition-all duration-250 hover:shadow-xl hover:ring-1 hover:ring-primary hover:-translate-y-1">
        {/* Cover Image */}
        <div className="aspect-square bg-secondary flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary" />
          <Music className="h-24 w-24 text-primary/40 relative z-10" />
          
          {/* Exclusive Badge */}
          {showExclusiveBadge && (
            <div className="absolute top-2 right-2 z-20">
              <Badge className="bg-primary text-primary-foreground gap-1">
                <Lock className="h-3 w-3" />
                Эксклюзив
              </Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h3 className="font-['Bebas_Neue'] text-xl tracking-wide group-hover:text-primary transition-colors">
            {release.title}
          </h3>
          <p className="text-sm text-muted-foreground">{release.artist?.name || 'Unknown Artist'}</p>
          <p className="text-xs text-muted-foreground">{new Date(release.release_date).getFullYear()}</p>
        </div>
      </div>
    </Link>
  );
}
