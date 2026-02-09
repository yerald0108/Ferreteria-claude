import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';
import { ProductGridSkeleton } from '@/components/skeletons/ProductCardSkeleton';
import { useProducts, useCategories } from '@/hooks/useProducts';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  
  const selectedCategory = searchParams.get('categoria') || 'all';

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 10000;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 100) * 100;
  }, [products]);

  // Initialize price range when products load
  useMemo(() => {
    if (maxPrice > 0 && priceRange[1] === 10000) {
      setPriceRange([0, maxPrice]);
    }
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || 
        product.categories?.name.toLowerCase() === selectedCategory.toLowerCase() ||
        product.category_id === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesStock = !onlyInStock || product.stock > 0;
      return matchesCategory && matchesSearch && matchesPrice && matchesStock;
    });
  }, [selectedCategory, searchTerm, products, priceRange, onlyInStock]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('categoria');
    } else {
      searchParams.set('categoria', categoryId);
    }
    setSearchParams(searchParams);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setOnlyInStock(false);
    handleCategoryChange('all');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || onlyInStock || 
    priceRange[0] > 0 || priceRange[1] < maxPrice;

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-72 shrink-0">
              <div className="bg-card rounded-xl p-6 shadow-sm border sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Filtros</h2>
                  </div>
                  {hasActiveFilters && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearAllFilters}
                      className="text-xs h-7 px-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Limpiar
                    </Button>
                  )}
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

                {/* Availability Filter */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stock-filter" className="text-sm font-medium cursor-pointer">
                      Solo productos disponibles
                    </Label>
                    <Switch
                      id="stock-filter"
                      checked={onlyInStock}
                      onCheckedChange={setOnlyInStock}
                    />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="text-sm font-medium text-foreground mb-4">Rango de precio</h3>
                  <div className="px-1">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      min={0}
                      max={maxPrice}
                      step={10}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0].toLocaleString()}</span>
                      <span>${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Categorías</h3>
                  <div className="space-y-1">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleCategoryChange('all')}
                    >
                      Todas las categorías
                    </Button>
                    {categories?.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id || selectedCategory.toLowerCase() === category.name.toLowerCase() ? 'default' : 'ghost'}
                        size="sm"
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

              {/* Active Filters Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      Búsqueda: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="hover:text-primary/70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {onlyInStock && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      Solo disponibles
                      <button onClick={() => setOnlyInStock(false)} className="hover:text-primary/70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      ${priceRange[0]} - ${priceRange[1]}
                      <button onClick={() => setPriceRange([0, maxPrice])} className="hover:text-primary/70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                      {categories?.find(c => c.id === selectedCategory)?.name}
                      <button onClick={() => handleCategoryChange('all')} className="hover:text-primary/70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ProductGridSkeleton count={6} />
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
                    onClick={clearAllFilters}
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
