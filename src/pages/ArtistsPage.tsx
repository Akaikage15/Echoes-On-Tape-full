import { ArtistCard } from '../components/ArtistCard';
import { artists } from '../lib/data';

export function ArtistsPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Артисты лейбла
          </h1>
          <p className="text-lg text-muted-foreground">
            Познакомьтесь с музыкантами Echoes On Tape
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
}
