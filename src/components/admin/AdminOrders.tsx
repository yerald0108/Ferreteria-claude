import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Package, Clock, User, MapPin, Phone, CreditCard } from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus, OrderWithProfile } from '@/hooks/useOrders';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export function AdminOrders() {
  const { data: orders, isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ 
        id: orderId, 
        status: newStatus as OrderWithProfile['status']
      });
      toast.success('Estado actualizado correctamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el estado');
    }
  };

  const filteredOrders = orders?.filter(order => 
    filterStatus === 'all' || order.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pedidos</SelectItem>
            {Object.entries(statusLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-sm text-muted-foreground">
          {filteredOrders?.length || 0} pedidos
        </span>
      </div>
      
      <div className="space-y-4">
        {filteredOrders?.map((order) => (
          <Card key={order.id} className="p-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      Pedido #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(order.created_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select 
                    value={order.status} 
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{order.customer_name || 'Cliente'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {order.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <span>{order.delivery_address}, {order.municipality}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    {order.payment_method} • Entrega: {order.delivery_time}
                  </div>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Productos ({order.order_items?.length || 0})
                </h4>
                <div className="space-y-2">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        {item.products?.image_url && (
                          <img 
                            src={item.products.image_url} 
                            alt={item.product_name}
                            className="w-10 h-10 object-cover rounded"
                          />
                        )}
                        <div>
                          <span className="font-medium">{item.product_name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-medium">{formatPrice(item.price_at_purchase * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Notes & Total */}
              {order.notes && (
                <div className="text-sm">
                  <span className="font-medium">Notas:</span>
                  <span className="text-muted-foreground ml-2">{order.notes}</span>
                </div>
              )}
              
              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Total:</span>
                  <span className="text-xl font-bold text-primary ml-2">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredOrders?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No hay pedidos {filterStatus !== 'all' ? 'con ese estado' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
