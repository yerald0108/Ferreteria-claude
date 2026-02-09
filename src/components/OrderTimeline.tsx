import { Check, Clock, Package, Truck, Home, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { key: 'pending', label: 'Pendiente', icon: Clock },
  { key: 'confirmed', label: 'Confirmado', icon: Check },
  { key: 'preparing', label: 'Preparando', icon: Package },
  { key: 'shipped', label: 'Enviado', icon: Truck },
  { key: 'delivered', label: 'Entregado', icon: Home },
];

interface OrderTimelineProps {
  status: string;
}

export function OrderTimeline({ status }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 py-3 px-4 rounded-lg bg-destructive/10 text-destructive">
        <X className="h-5 w-5" />
        <span className="text-sm font-medium">Pedido cancelado</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="py-3">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.key} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                    isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                    isCurrent && 'ring-4 ring-primary/20 scale-110'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    'text-[11px] font-medium text-center hidden sm:block',
                    isCompleted ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-1 rounded-full transition-colors duration-300',
                    index < currentIndex ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
