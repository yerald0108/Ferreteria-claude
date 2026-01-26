import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2 } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useProducts';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const selectedCategory = searchParams.get('categoria') || 'all';

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || 
        product.categories?.name.toLowerCase() === selectedCategory.toLowerCase() ||
        product.category_id === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm, products]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', categoryId);
    }
    setSearchParams(searchParams);
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-64 shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-sm border sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Filtros</h2>
                </div>
                
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Categorías</h3>
                  <div className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => handleCategoryChange('all')}
                    >
                      Todas las categorías
                    </Button>
                    {categories?.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id || selectedCategory.toLowerCase() === category.name.toLowerCase() ? 'default' : 'ghost'}
                        className="w-full justify-start gap-2"
                        onClick={() => handleCategoryChange(category.id)}
                      >
                        <span>{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
            
            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {selectedCategory === 'all' 
                      ? 'Todos los Productos' 
                      : categories?.find(c => c.id === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase())?.name || 'Productos'}
                  </h1>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} productos encontrados
                  </p>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
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
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No se encontraron productos con esos criterios.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      handleCategoryChange('all');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
