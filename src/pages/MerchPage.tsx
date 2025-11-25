import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useSessionStore } from '../lib/store';
import { MerchItem } from '../types'; // Imported MerchItem
import { fetchAllMerchItems } from '../lib/services'; // Imported fetchAllMerchItems
import { Skeleton } from '../components/ui/skeleton';


export function MerchPage() {
  const navigate = useNavigate();
  const { currentUser } = useSessionStore();
  const [merchItems, setMerchItems] = useState<MerchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    const loadMerchItems = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedMerchItems = await fetchAllMerchItems();
        setMerchItems(fetchedMerchItems);
      } catch (err: any) {
        setError('Не удалось загрузить товары. Попробуйте обновить страницу.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMerchItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return merchItems;
    return merchItems.filter(item => item.type === categoryFilter);
  }, [categoryFilter, merchItems]);

  const getDiscount = () => {
    if (!currentUser || !currentUser.subscriptionTier) return 0;
    if (currentUser.subscriptionTier === 'pro') return 20;
    if (currentUser.subscriptionTier === 'fan') return 15;
    if (currentUser.subscriptionTier === 'lite') return 10;
    return 0;
  };

  const discount = getDiscount();

  const addToCart = (itemId: string) => {
    setCart([...cart, itemId]);
    alert('Товар добавлен в корзину!');
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'clothing': return 'Одежда';
      case 'accessory': return 'Аксессуары';
      case 'poster': return 'Постеры';
      default: return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-12">
            <Skeleton className="h-10 w-2/3 mb-4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
          </div>

          <div className="mb-8 flex space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[250px] w-full" />
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
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Магазин мерча
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Официальный мерч Echoes On Tape
          </p>
          {discount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-lg">
              <Tag className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">
                Ваша скидка подписчика: {discount}%
              </span>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="mb-8">
          <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
            <TabsList>
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="clothing">Одежда</TabsTrigger>
              <TabsTrigger value="accessory">Аксессуары</TabsTrigger>
              <TabsTrigger value="poster">Постеры</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => {
              const finalPrice = item.price * (1 - discount / 100);

              return (
                <div
                  key={item.id}
                  className="bg-card/80 backdrop-blur-md rounded-lg overflow-hidden transition-all hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="aspect-square bg-secondary flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary" />
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                    ) : (
                      <ShoppingCart className="h-24 w-24 text-primary/30 relative z-10" />
                    )}
                    
                    {/* Discount Badge */}
                    {discount > 0 && (
                      <div className="absolute top-2 right-2 z-20">
                        <Badge className="bg-primary text-primary-foreground">
                          -{discount}%
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 z-20">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {getCategoryLabel(item.type)}
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-['Bebas_Neue'] text-xl tracking-wide line-clamp-2">
                        {item.title}
                      </h3>

                      {item.sizes && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.sizes.map(size => (
                            <Badge key={size} variant="outline" className="text-xs">
                              {size}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-baseline gap-2 mt-3">
                        {discount > 0 ? (
                          <>
                            <span className="font-['Bebas_Neue'] text-2xl text-primary">
                              {Math.round(finalPrice)}₽
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {item.price}₽
                            </span>
                          </>
                        ) : (
                          <span className="font-['Bebas_Neue'] text-2xl">
                            {item.price}₽
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={() => addToCart(item.id)}
                      className="w-full gap-2 bg-primary text-primary-foreground hover:bg-accent-secondary mt-4"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      В корзину
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Товары появятся скоро</p>
          </div>
        )}

        {/* Info */}
        {!currentUser && (
          <div className="mt-12 p-6 bg-primary/5 backdrop-blur-md border border-primary/20 rounded-lg text-center max-w-2xl mx-auto">
            <Tag className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-['Bebas_Neue'] text-2xl mb-2">
              Подписчики получают скидки
            </h3>
            <p className="text-muted-foreground mb-4">
              Lite — 10%, Fan — 15%, Pro — 20% на весь мерч
            </p>
            <Button onClick={() => navigate('/pricing')} className="bg-primary text-primary-foreground hover:bg-accent-secondary">
              Оформить подписку
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
