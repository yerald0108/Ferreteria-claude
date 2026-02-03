import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useProducts, useCategories } from '@/hooks/useProducts';

const Index = () => {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const featuredProducts = products?.slice(0, 4) || [];
  
  const getCategoryProductCount = (categoryId: string) => {
    return products?.filter(p => p.category_id === categoryId).length || 0;
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        {/* Categories Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground">Nuestras Categorías</h2>
              <p className="text-muted-foreground mt-2">
                Encuentra todo lo que necesitas para tus proyectos
              </p>
            </div>
            
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories?.map((category) => (
                  <CategoryCard
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    icon={category.icon || '📦'}
                    productCount={getCategoryProductCount(category.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Productos Destacados</h2>
                <p className="text-muted-foreground mt-2">
                  Los más vendidos de nuestra tienda
                </p>
              </div>
              <Link to="/productos">
                <Button variant="outline" className="gap-2">
                  Ver Todos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {productsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : featuredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image_url || '/placeholder.svg',
                      category: product.categories?.name || '',
                      description: product.description || '',
                      stock: product.stock,
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No hay productos disponibles aún. ¡Pronto agregaremos más!
              </div>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
              Regístrate ahora y recibe tus herramientas y materiales directamente en tu puerta. 
              Sin filas, sin esperas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/registro">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Crear Mi Cuenta
                </Button>
              </Link>
              <Link to="/productos">
                <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Explorar Catálogo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
