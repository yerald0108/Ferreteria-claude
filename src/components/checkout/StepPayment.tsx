import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, Banknote, Smartphone, ShieldCheck } from 'lucide-react';

interface StepPaymentProps {
  paymentMethod: string;
  onPaymentChange: (value: string) => void;
}

const paymentOptions = [
  {
    value: 'efectivo',
    label: 'Efectivo (CUP)',
    description: 'Paga al recibir tu pedido',
    icon: Banknote,
    iconColor: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    value: 'transfermovil',
    label: 'Transfermóvil',
    description: 'Transferencia antes de la entrega',
    icon: Smartphone,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    value: 'tarjeta',
    label: 'Tarjeta (MLC)',
    description: 'Pago con tarjeta en MLC',
    icon: CreditCard,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

export const StepPayment = ({ paymentMethod, onPaymentChange }: StepPaymentProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Método de Pago</h2>
            <p className="text-sm text-muted-foreground">Elige cómo quieres pagar tu pedido</p>
          </div>
        </div>

        <RadioGroup
          value={paymentMethod}
          onValueChange={onPaymentChange}
          className="grid gap-4"
        >
          {paymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.value}
                className={`relative flex items-center space-x-4 border-2 rounded-xl p-5 cursor-pointer transition-all ${
                  paymentMethod === option.value
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => onPaymentChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                <div className={`p-3 rounded-lg ${option.bgColor}`}>
                  <Icon className={`h-6 w-6 ${option.iconColor}`} />
                </div>
                <Label htmlFor={option.value} className="cursor-pointer flex-1">
                  <span className="font-semibold text-foreground text-lg">{option.label}</span>
                  <span className="block text-sm text-muted-foreground mt-0.5">
                    {option.description}
                  </span>
                </Label>
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                    paymentMethod === option.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/50'
                  }`}
                >
                  {paymentMethod === option.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </Card>

      {/* Security Badge */}
      <Card className="p-5 bg-muted/30 border-dashed">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-100">
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Compra Segura</p>
            <p className="text-xs text-muted-foreground">
              Tus datos están protegidos. Te contactaremos para confirmar antes del cobro.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
