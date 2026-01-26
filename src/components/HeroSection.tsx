import { ArrowRight, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-secondary/90">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-secondary-foreground space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Truck className="h-4 w-4" />
              Entrega a domicilio en toda la provincia
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Todo para tu <span className="text-primary">hogar</span> y{' '}
              <span className="text-accent">proyectos</span>
            </h1>
            
            <p className="text-lg text-secondary-foreground/80 max-w-lg">
              La ferretería más completa de Cuba. Herramientas, materiales de construcción, 
              plomería, electricidad y más. Compra fácil, pago seguro, entrega rápida.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/productos">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Ver Productos
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/registro">
                <Button size="lg" variant="outline" className="text-lg px-8 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  Crear Cuenta
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl transform rotate-3"></div>
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=500&fit=crop"
              alt="Herramientas de ferretería"
              className="relative rounded-3xl shadow-2xl object-cover w-full h-[500px]"
            />
          </div>
        </div>
        
        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="flex items-center gap-4 bg-secondary-foreground/5 rounded-xl p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-foreground">Entrega a Domicilio</h3>
              <p className="text-sm text-secondary-foreground/70">En toda la provincia</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-secondary-foreground/5 rounded-xl p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-foreground">Compra Segura</h3>
              <p className="text-sm text-secondary-foreground/70">Múltiples formas de pago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-secondary-foreground/5 rounded-xl p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <Clock className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-foreground">Horarios Flexibles</h3>
              <p className="text-sm text-secondary-foreground/70">Tú eliges cuándo recibirlo</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
