import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Artist } from '../types';

interface ArtistCardProps {
  artist: Artist;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link to={`/artist/${artist.id}`} className="group block">
      <div className="overflow-hidden rounded-md bg-card/80 backdrop-blur-md transition-all duration-250 hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1">
        {/* Avatar */}
        <div className="aspect-square bg-secondary flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary" />
          <User className="h-32 w-32 text-primary/30 relative z-10" />
        </div>

        {/* Info */}
        <div className="p-4 space-y-1">
          <h3 className="font-['Bebas_Neue'] text-2xl tracking-wide group-hover:text-primary transition-colors">
            {artist.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
