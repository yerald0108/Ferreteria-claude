import { useNavigate } from 'react-router-dom';
import { useUserOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Calendar, MapPin, CreditCard, Eye, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmado', variant: 'default' },
  preparing: { label: 'Preparando', variant: 'default' },
  shipped: { label: 'Enviado', variant: 'default' },
  delivered: { label: 'Entregado', variant: 'outline' },
  cancelled: { label: 'Cancelado', variant: 'destructive' },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: orders, isLoading, error } = useUserOrders();

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    navigate('/login');
    return null;
  }

  const formatOrderId = (id: string) => id.slice(0, 8).toUpperCase();

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d 'de' MMMM, yyyy - HH:mm", { locale: es });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
    }).format(amount);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Mis Pedidos</h1>
          </div>

          {isLoading || authLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-destructive mb-4">Error al cargar los pedidos</p>
                <Button onClick={() => window.location.reload()}>Reintentar</Button>
              </CardContent>
            </Card>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || { label: order.status, variant: 'secondary' as const };
                
                return (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-muted/50 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-semibold">
                            Pedido #{formatOrderId(order.id)}
                          </CardTitle>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <div className="grid gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{order.delivery_address}, {order.municipality}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CreditCard className="h-4 w-4" />
                          <span className="capitalize">{order.payment_method}</span>
                        </div>

                        {order.order_items && order.order_items.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="font-medium mb-2">Productos:</p>
                            <ul className="space-y-1">
                              {order.order_items.map((item) => (
                                <li key={item.id} className="flex justify-between text-muted-foreground">
                                  <span>{item.quantity}x {item.product_name}</span>
                                  <span>{formatCurrency(item.price_at_purchase * item.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/pedido/${order.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardContent className="space-y-4">
                <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No tienes pedidos aún</h3>
                  <p className="text-muted-foreground mb-6">
                    ¡Explora nuestros productos y realiza tu primer pedido!
                  </p>
                  <Button onClick={() => navigate('/productos')}>
                    Ver productos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyOrders;
