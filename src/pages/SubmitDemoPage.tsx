import { useState } from 'react';
import { Upload, CheckCircle, Clock, XCircle, Music } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { currentUser } from '../lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export function SubmitDemoPage() {
  const [formData, setFormData] = useState({
    artistName: '',
    email: currentUser?.email || '',
    trackUrl: '',
    genre: '',
    comment: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Mock submitted demos
  const myDemos = [
    { id: '1', title: 'Night Drive', date: '2024-11-10', status: 'На рассмотрении' },
    { id: '2', title: 'Synthwave Dreams', date: '2024-10-15', status: 'Прослушано' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.artistName || !formData.email || (!formData.trackUrl && !file) || !formData.genre) {
      alert('Заполните все обязательные поля');
      return;
    }

    setSubmitted(true);
    alert('Ваше демо отправлено! Мы рассмотрим его в ближайшее время.');
    
    // Reset form
    setFormData({
      artistName: '',
      email: currentUser?.email || '',
      trackUrl: '',
      genre: '',
      comment: '',
    });
    setFile(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'На рассмотрении': return <Clock className="h-4 w-4 text-warning" />;
      case 'Прослушано': return <CheckCircle className="h-4 w-4 text-info" />;
      case 'Принято': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'Отклонено': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'На рассмотрении': return 'border-warning text-warning';
      case 'Прослушано': return 'border-info text-info';
      case 'Принято': return 'border-success text-success';
      case 'Отклонено': return 'border-destructive text-destructive';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
              Отправить демо
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Отправьте нам свою музыку для возможного подписания на лейбл
            </p>
            {currentUser?.subscription === 'pro' && (
              <Badge className="bg-primary text-primary-foreground gap-2">
                <Music className="h-3 w-3" />
                Ваше демо в приоритете
              </Badge>
            )}
          </div>

          {/* Form */}
          <div className="bg-card p-6 md:p-8 rounded-lg mb-12">
            <h2 className="font-['Bebas_Neue'] text-3xl mb-6">Загрузить трек</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="artistName">
                    Имя артиста <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="artistName"
                    type="text"
                    placeholder="Ваш сценический псевдоним"
                    value={formData.artistName}
                    onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                    required
                    className="bg-secondary border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trackUrl">
                  Ссылка на трек (SoundCloud / YouTube)
                </Label>
                <Input
                  id="trackUrl"
                  type="url"
                  placeholder="https://soundcloud.com/..."
                  value={formData.trackUrl}
                  onChange={(e) => setFormData({ ...formData, trackUrl: e.target.value })}
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Или загрузите файл ниже
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">
                  Загрузить файл (MP3 / WAV, макс. 50 MB)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept=".mp3,.wav"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="bg-secondary border-border"
                  />
                  {file && (
                    <Badge variant="outline">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">
                  Жанр <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="genre"
                  type="text"
                  placeholder="Например: Dark Ambient, Synthwave, Dream Pop"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  required
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Комментарий</Label>
                <Textarea
                  id="comment"
                  placeholder="Расскажите о треке, вдохновении, процессе создания..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                  className="bg-secondary border-border resize-none"
                />
              </div>

              {!currentUser?.subscription && (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Совет:</strong> Pro-подписчики получают 
                    приоритетное рассмотрение демо и могут отправлять неограниченное количество треков.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary"
              >
                <Upload className="h-4 w-4" />
                Отправить демо
              </Button>
            </form>
          </div>

          {/* My Demos */}
          {currentUser && myDemos.length > 0 && (
            <div className="bg-card p-6 md:p-8 rounded-lg">
              <h2 className="font-['Bebas_Neue'] text-3xl mb-6">Мои демо</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Дата отправки</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myDemos.map(demo => (
                    <TableRow key={demo.id}>
                      <TableCell className="font-medium">{demo.title}</TableCell>
                      <TableCell>
                        {new Date(demo.date).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-2 ${getStatusColor(demo.status)}`}>
                          {getStatusIcon(demo.status)}
                          {demo.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
