import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowLeft, Package, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductDetailSkeleton } from '@/components/skeletons/ProductDetailSkeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { StarRating } from '@/components/reviews/StarRating';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { ReviewList } from '@/components/reviews/ReviewList';
import { RelatedProducts } from '@/components/RelatedProducts';
import { useProductReviews, useUserReview, useProductRating, useHasPurchased } from '@/hooks/useReviews';
import { useAuth } from '@/hooks/useAuth';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const addItem = useCartStore((state) => state.addItem);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Fetch product
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch reviews
  const { data: reviews = [], isLoading: reviewsLoading } = useProductReviews(id || '');
  const { data: userReview } = useUserReview(id || '');
  const { data: hasPurchased } = useHasPurchased(id || '');
  const rating = useProductRating(id || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_url || '/placeholder.svg',
        description: product.description || '',
        category: product.categories?.name || '',
        stock: product.stock,
      });
      toast.success(`${product.name} añadido al carrito`);
    }
  };

  if (productLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Producto no encontrado</h1>
            <p className="text-muted-foreground mb-6">
              El producto que buscas no existe o ya no está disponible
            </p>
            <Link to="/productos">
              <Button size="lg">Ver Productos</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canReview = user && hasPurchased && !userReview;
  const hasUserReview = !!userReview;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Link to="/productos" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>

          {/* Product Info */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.stock === 0 ? (
                <Badge variant="destructive" className="absolute top-4 right-4 text-lg px-4 py-2">
                  Agotado
                </Badge>
              ) : product.stock < 10 ? (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  ¡Últimas unidades!
                </Badge>
              ) : null}
            </div>

            {/* Details */}
            <div className="space-y-6">
              {product.categories && (
                <Badge variant="secondary">{product.categories.name}</Badge>
              )}
              
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
              
              {rating.totalReviews > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={rating.averageRating} showValue totalReviews={rating.totalReviews} />
                </div>
              )}

              <p className="text-lg text-muted-foreground">{product.description}</p>
              
              <div className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span>
                  {product.stock === 0 
                    ? 'Sin stock disponible' 
                    : `${product.stock} unidades disponibles`
                  }
                </span>
              </div>

              <Separator />

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full gap-2"
                disabled={product.stock === 0}
                variant={product.stock === 0 ? "secondary" : "default"}
              >
                {product.stock === 0 ? (
                  'Producto Agotado'
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Añadir al carrito
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                Opiniones de clientes
              </h2>
              
              {canReview && !showReviewForm && (
                <Button onClick={() => setShowReviewForm(true)}>
                  Escribir reseña
                </Button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Tu opinión</CardTitle>
                </CardHeader>
                <CardContent>
                  <ReviewForm
                    productId={product.id}
                    existingReview={userReview}
                    onSuccess={() => setShowReviewForm(false)}
                    onCancel={() => setShowReviewForm(false)}
                  />
                </CardContent>
              </Card>
            )}

            {/* Edit existing review */}
            {hasUserReview && !showReviewForm && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">Tu reseña</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={userReview!.rating} size="sm" />
                        {userReview!.comment && (
                          <span className="text-sm text-muted-foreground truncate max-w-xs">
                            "{userReview!.comment}"
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>
                      Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Login prompt */}
            {!user && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    Inicia sesión para dejar tu opinión sobre este producto
                  </p>
                  <Link to="/login">
                    <Button variant="outline">Iniciar sesión</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Purchase required prompt */}
            {user && !hasPurchased && !userReview && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Solo los clientes que han comprado este producto pueden dejar una reseña
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="p-4 border rounded-lg space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ))}
              </div>
            ) : (
              <ReviewList
                productId={product.id}
                reviews={reviews}
                onEditReview={() => setShowReviewForm(true)}
              />
            )}
          </div>

          {/* Related Products */}
          <RelatedProducts 
            currentProductId={product.id} 
            categoryId={product.category_id} 
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
