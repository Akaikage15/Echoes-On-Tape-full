import { useState, useEffect } from 'react';
import { useSessionStore } from '../lib/store';
import { createDemoSubmission, fetchAllDemos, updateDemoStatus } from '../lib/services';
import { BackendDemo, Demo } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function SubmitDemoPage() {
  const { currentUser, isAuthenticated } = useSessionStore();
  const navigate = useNavigate();

  const [artistName, setArtistName] = useState('');
  const [email, setEmail] = useState('');
  const [trackUrl, setTrackUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [comment, setComment] = useState('');
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const [myDemos, setMyDemos] = useState<BackendDemo[]>([]);
  const [demosLoading, setDemosLoading] = useState(true);
  const [demosError, setDemosError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/');
      return;
    }
    fetchMyDemos();
  }, [isAuthenticated, currentUser, navigate]);

  const fetchMyDemos = async () => {
    setDemosLoading(true);
    setDemosError(null);
    try {
      const allDemos = await fetchAllDemos();
      // In a real app, filter demos by currentUser.id if user_id is on backend demo
      setMyDemos(allDemos.filter(demo => demo.user_id === currentUser?.id));
    } catch (err: any) {
      setDemosError('Не удалось загрузить ваши демо.');
      toast.error('Не удалось загрузить ваши демо.');
      console.error(err);
    } finally {
      setDemosLoading(false);
    }
  };

  const handleSubmitDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !currentUser) {
      toast.error('Вы должны быть авторизованы для отправки демо.');
      return;
    }

    setSubmissionLoading(true);
    try {
      const newDemo: Omit<BackendDemo, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at'> = {
        artist_name: artistName,
        email: email,
        track_url: trackUrl,
        genre: genre,
        comment: comment,
        upload_date: new Date().toISOString(),
      };
      await createDemoSubmission(newDemo);
      toast.success('Демо успешно отправлено!');
      // Clear form
      setArtistName('');
      setEmail('');
      setTrackUrl('');
      setGenre('');
      setComment('');
      fetchMyDemos(); // Refresh demos list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Не удалось отправить демо.');
      console.error(err);
    } finally {
      setSubmissionLoading(false);
    }
  };

  const getStatusColor = (status: BackendDemo['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'reviewed': return 'bg-blue-500/20 text-blue-500';
      case 'accepted': return 'bg-green-500/20 text-green-500';
      case 'rejected': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (!isAuthenticated || !currentUser) {
    return null; // Should redirect, but just in case
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
              Отправить демо
            </h1>
            <p className="text-lg text-muted-foreground">
              У вас есть что-то уникальное? Отправьте нам свое демо!
            </p>
          </div>

          {/* Submission Form */}
          <div className="bg-card p-6 rounded-lg shadow-md mb-12">
            <h2 className="font-['Bebas_Neue'] text-3xl mb-6">
              Новая отправка
            </h2>
            <form onSubmit={handleSubmitDemo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="artistName">Имя артиста</Label>
                  <Input
                    id="artistName"
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                    disabled={submissionLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email для связи</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={submissionLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="trackUrl">Ссылка на трек (SoundCloud/YouTube)</Label>
                <Input
                  id="trackUrl"
                  type="url"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.target.value)}
                  required
                  disabled={submissionLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Жанр</Label>
                <Input
                  id="genre"
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  required
                  disabled={submissionLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий (необязательно)</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  disabled={submissionLoading}
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-accent-secondary" disabled={submissionLoading}>
                {submissionLoading ? 'Отправка...' : 'Отправить демо'}
              </Button>
            </form>
          </div>

          {/* My Demos Table */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="font-['Bebas_Neue'] text-3xl mb-6">Мои отправки</h2>
            {demosLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : demosError ? (
              <div className="text-center py-8">
                <p className="text-destructive">{demosError}</p>
                <Button onClick={fetchMyDemos} className="mt-4">Повторить</Button>
              </div>
            ) : myDemos.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Артист</TableHead>
                      <TableHead>Трек</TableHead>
                      <TableHead>Жанр</TableHead>
                      <TableHead>Дата отправки</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myDemos.map((demo) => (
                      <TableRow key={demo.id}>
                        <TableCell className="font-medium">{demo.artist_name}</TableCell>
                        <TableCell>
                          <a href={demo.track_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {demo.track_url.length > 30 ? demo.track_url.substring(0, 27) + '...' : demo.track_url}
                          </a>
                        </TableCell>
                        <TableCell>{demo.genre}</TableCell>
                        <TableCell>{new Date(demo.upload_date).toLocaleDateString('ru-RU')}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(demo.status)}`}>
                            {
                            demo.status === 'pending' ? 'В ожидании' :
                            demo.status === 'reviewed' ? 'Рассмотрено' :
                            demo.status === 'accepted' ? 'Принято' :
                            demo.status === 'rejected' ? 'Отклонено' :
                            demo.status
                            }
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="font-['Bebas_Neue'] text-2xl mb-4">
                  Вы пока не отправляли демо
                </h3>
                <p className="text-muted-foreground">
                  Используйте форму выше, чтобы отправить свой первый трек!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}