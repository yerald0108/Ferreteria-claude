import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/lib/store';
import { Loader2, ShoppingBag, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  canProceed: boolean;
}

export const OrderSummary = ({
  items,
  totalPrice,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSubmit,
  isSubmitting,
  canProceed,
}: OrderSummaryProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CU', {
      style: 'currency',
      currency: 'CUP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Tu Pedido</h2>
        <span className="ml-auto text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="space-y-3 mb-6 max-h-52 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-14 h-14 object-cover rounded-lg border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {item.product.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.quantity} x {formatPrice(item.product.price)}
              </p>
              <p className="text-sm font-semibold text-primary">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2 mb-6">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Envío</span>
          <span className="text-green-600 font-medium">Por confirmar</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t">
          <span>Total</span>
          <span className="text-primary">{formatPrice(totalPrice)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {isLastStep ? (
          <Button
            onClick={onSubmit}
            size="lg"
            className="w-full h-12 text-base"
            disabled={isSubmitting || !canProceed}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Confirmar Pedido
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            size="lg"
            className="w-full h-12 text-base"
            disabled={!canProceed}
          >
            Continuar
            <ArrowRight className="h-5 w-5" />
          </Button>
        )}

        {!isFirstStep && (
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            className="w-full h-12 text-base"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Te contactaremos para confirmar tu pedido
      </p>
    </Card>
  );
};
