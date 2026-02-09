import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/hooks/useAuth';
import { Heart } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/skeletons/ProductCardSkeleton';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Favorites() {
  const { user, loading: authLoading } = useAuth();
  const { favorites, isLoading } = useFavorites();

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductGridSkeleton count={4} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const favoriteProducts = favorites
    .filter((fav) => fav.products && fav.products.is_active)
    .map((fav) => ({
      id: fav.products!.id,
      name: fav.products!.name,
      price: fav.products!.price,
      image: fav.products!.image_url || '/placeholder.svg',
      stock: fav.products!.stock,
      description: fav.products!.description || '',
      category: fav.products!.categories?.name || 'Sin categoría',
    }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-destructive" />
          <h1 className="text-3xl font-bold text-foreground">Mis Favoritos</h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductGridSkeleton count={4} />
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No tienes productos favoritos
            </h2>
            <p className="text-muted-foreground mb-6">
              Explora nuestro catálogo y guarda los productos que te interesen
            </p>
            <Button asChild>
              <Link to="/productos">Ver productos</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto' : 'productos'} en tu lista
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
