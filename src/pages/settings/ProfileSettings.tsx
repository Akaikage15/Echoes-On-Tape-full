import { useState, useEffect } from 'react';
import { useSessionStore } from '@/lib/store';
import { getProfile, updateProfile, UpdateProfileDto } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

/**
 * Компонент редактирования профиля пользователя
 * Позволяет изменить: имя, email, биографию, социальные ссылки
 */
const ProfileSettings = () => {
  const currentUser = useSessionStore((state) => state.currentUser);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState<UpdateProfileDto>({
    name: '',
    email: '',
    bio: '',
    socialLinks: {
      instagram: '',
      twitter: '',
      spotify: '',
    },
  });

  // Загрузка данных профиля
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getProfile();
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          bio: data.user.bio || '',
          socialLinks: data.user.social_links || {
            instagram: '',
            twitter: '',
            spotify: '',
          },
        });
      } catch (error) {
        console.error('Ошибка загрузки профиля:', error);
        toast.error('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (field: keyof UpdateProfileDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateProfile(formData);
      toast.success('Профиль успешно обновлён');
      setHasChanges(false);
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);
      toast.error(error.response?.data?.error || 'Не удалось обновить профиль');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Редактирование профиля</CardTitle>
        <CardDescription>Обновите информацию о себе</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Имя */}
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ваше имя"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          {/* Биография */}
          <div className="space-y-2">
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Расскажите о себе..."
              rows={4}
              maxLength={500}
            />
            <p className="text-sm text-muted-foreground">
              {formData.bio?.length || 0} / 500 символов
            </p>
          </div>

          {/* Социальные сети */}
          <div className="space-y-4">
            <Label>Социальные сети</Label>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="text-sm font-normal">
                Instagram
              </Label>
              <Input
                id="instagram"
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="text-sm font-normal">
                Twitter
              </Label>
              <Input
                id="twitter"
                value={formData.socialLinks?.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spotify" className="text-sm font-normal">
                Spotify
              </Label>
              <Input
                id="spotify"
                value={formData.socialLinks?.spotify || ''}
                onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            <Button type="submit" disabled={!hasChanges || saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить изменения'
              )}
            </Button>

            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Отменить
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
