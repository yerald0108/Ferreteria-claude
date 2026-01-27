import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCreateOrder } from '@/hooks/useOrders';
import { useUserProfile, useUpdateProfile } from '@/hooks/useProfile';
import { CheckoutProgress } from '@/components/checkout/CheckoutProgress';
import { StepContactInfo } from '@/components/checkout/StepContactInfo';
import { StepDelivery } from '@/components/checkout/StepDelivery';
import { StepPayment } from '@/components/checkout/StepPayment';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const STEPS = [
  { number: 1, title: 'Contacto', description: 'Tus datos' },
  { number: 2, title: 'Entrega', description: 'Dirección y horario' },
  { number: 3, title: 'Pago', description: 'Método de pago' },
];

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [saveToProfile, setSaveToProfile] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    municipality: '',
    deliveryTime: '',
    paymentMethod: 'efectivo',
    notes: '',
  });

  // Auto-fill form with profile data when loaded
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        phone: profile.phone || prev.phone,
        email: profile.email || user?.email || prev.email,
        address: profile.address || prev.address,
        municipality: profile.municipality || prev.municipality,
      }));
    } else if (user?.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
      }));
    }
  }, [profile, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.fullName.trim()) {
          toast.error('Por favor ingresa tu nombre completo');
          return false;
        }
        if (!formData.phone.trim() || formData.phone.length < 8) {
          toast.error('Por favor ingresa un número de teléfono válido');
          return false;
        }
        return true;
      case 2:
        if (!formData.municipality) {
          toast.error('Por favor selecciona tu municipio');
          return false;
        }
        if (!formData.address.trim()) {
          toast.error('Por favor ingresa tu dirección completa');
          return false;
        }
        if (!formData.deliveryTime) {
          toast.error('Por favor selecciona un horario de entrega');
          return false;
        }
        return true;
      case 3:
        if (!formData.paymentMethod) {
          toast.error('Por favor selecciona un método de pago');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.fullName.trim().length > 0 && formData.phone.trim().length >= 8;
      case 2:
        return formData.municipality.length > 0 && formData.address.trim().length > 0 && formData.deliveryTime.length > 0;
      case 3:
        return formData.paymentMethod.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para realizar un pedido');
      navigate('/login');
      return;
    }

    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    try {
      const order = {
        user_id: user.id,
        total_amount: getTotalPrice(),
        delivery_address: formData.address,
        municipality: formData.municipality,
        phone: formData.phone,
        delivery_time: formData.deliveryTime,
        payment_method: formData.paymentMethod,
        notes: formData.notes || null,
      };

      const orderItems = items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price_at_purchase: item.product.price,
      }));

      const orderData = await createOrder.mutateAsync({ order, items: orderItems });

      // Save profile data if checkbox is checked
      if (saveToProfile) {
        try {
          await updateProfile.mutateAsync({
            full_name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            municipality: formData.municipality,
          });
        } catch (profileError) {
          // Don't fail the order if profile save fails
          console.error('Error saving profile:', profileError);
        }
      }

      toast.success('¡Pedido realizado con éxito!');
      clearCart();
      
      // Redirigir a la página de confirmación
      navigate(`/pedido/${orderData.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar el pedido');
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">No hay productos en tu carrito</h1>
            <p className="text-muted-foreground mb-6">
              Añade algunos productos antes de proceder al pago
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

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Inicia sesión para continuar</h1>
            <p className="text-muted-foreground mb-6">
              Necesitas una cuenta para realizar pedidos
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login">
                <Button size="lg">Iniciar Sesión</Button>
              </Link>
              <Link to="/registro">
                <Button size="lg" variant="outline">Crear Cuenta</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepContactInfo
            formData={{ fullName: formData.fullName, phone: formData.phone, email: formData.email }}
            onInputChange={handleInputChange}
          />
        );
      case 2:
        return (
          <StepDelivery
            formData={{
              address: formData.address,
              municipality: formData.municipality,
              deliveryTime: formData.deliveryTime,
              notes: formData.notes,
            }}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
        );
      case 3:
        return (
          <div className="space-y-6">
            <StepPayment
              paymentMethod={formData.paymentMethod}
              onPaymentChange={(value) => handleSelectChange('paymentMethod', value)}
            />
            
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg border">
              <Checkbox
                id="saveProfile"
                checked={saveToProfile}
                onCheckedChange={(checked) => setSaveToProfile(checked === true)}
              />
              <Label htmlFor="saveProfile" className="text-sm cursor-pointer flex items-center gap-2">
                <Save className="h-4 w-4 text-muted-foreground" />
                Guardar mis datos para futuros pedidos
              </Label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Link to="/carrito" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al carrito
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">Finalizar Compra</h1>
          <p className="text-muted-foreground mb-8">Completa los pasos para confirmar tu pedido</p>
          
          <CheckoutProgress currentStep={currentStep} steps={STEPS} />
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {renderStep()}
            </div>
            
            <div>
              <OrderSummary
                items={items}
                totalPrice={getTotalPrice()}
                currentStep={currentStep}
                totalSteps={STEPS.length}
                onNext={handleNext}
                onBack={handleBack}
                onSubmit={handleSubmit}
                isSubmitting={createOrder.isPending}
                canProceed={canProceedToNext()}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
