import { useState, useMemo } from 'react';
import { ShoppingCart, Tag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { merchItems, currentUser } from '../lib/data';

export function MerchPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cart, setCart] = useState<string[]>([]);

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return merchItems;
    return merchItems.filter(item => item.category === categoryFilter);
  }, [categoryFilter]);

  const getDiscount = () => {
    if (!currentUser || !currentUser.subscription) return 0;
    if (currentUser.subscription === 'pro') return 20;
    if (currentUser.subscription === 'fan') return 15;
    if (currentUser.subscription === 'lite') return 10;
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
      case 'accessories': return 'Аксессуары';
      case 'posters': return 'Постеры';
      default: return category;
    }
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-6xl tracking-wide mb-4">
            Магазин мерча
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            Официальный мерч Echoes On Tape
          </p>
          {discount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
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
              <TabsTrigger value="accessories">Аксессуары</TabsTrigger>
              <TabsTrigger value="posters">Постеры</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => {
              const hasSubscriberDiscount = currentUser && item.discountPercent;
              const finalPrice = hasSubscriberDiscount 
                ? item.price * (1 - (item.discountPercent || 0) / 100)
                : item.price;

              return (
                <div
                  key={item.id}
                  className="bg-card rounded-lg overflow-hidden transition-all hover:shadow-md hover:ring-1 hover:ring-primary hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="aspect-square bg-secondary flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary" />
                    <ShoppingCart className="h-24 w-24 text-primary/30 relative z-10" />
                    
                    {/* Discount Badge */}
                    {hasSubscriberDiscount && (
                      <div className="absolute top-2 right-2 z-20">
                        <Badge className="bg-primary text-primary-foreground">
                          -{item.discountPercent}%
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2 z-20">
                      <Badge variant="outline" className="bg-background/80 backdrop-blur">
                        {getCategoryLabel(item.category)}
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
                        {hasSubscriberDiscount ? (
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
          <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center max-w-2xl mx-auto">
            <Tag className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-['Bebas_Neue'] text-2xl mb-2">
              Подписчики получают скидки
            </h3>
            <p className="text-muted-foreground mb-4">
              Lite — 10%, Fan — 15%, Pro — 20% на весь мерч
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-accent-secondary">
              Оформить подписку
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
