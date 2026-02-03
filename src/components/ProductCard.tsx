import { Plus, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} añadido al carrito`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/producto/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        {product.stock === 0 ? (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Agotado
          </Badge>
        ) : product.stock < 10 ? (
          <Badge variant="destructive" className="absolute top-2 right-2">
            ¡Últimas unidades!
          </Badge>
        ) : null}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            {product.stock} disponibles
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          className="w-full gap-2"
          disabled={product.stock === 0}
          variant={product.stock === 0 ? "secondary" : "default"}
        >
          {product.stock === 0 ? (
            <>Agotado</>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Añadir al carrito
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
