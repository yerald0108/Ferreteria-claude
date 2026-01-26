import { Wrench, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wrench className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">FerreHogar</h3>
                <p className="text-xs text-secondary-foreground/70">Tu ferretería en casa</p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/70">
              La mejor selección de herramientas y materiales de construcción con entrega a domicilio en toda la provincia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li><Link to="/productos" className="hover:text-primary transition-colors">Productos</Link></li>
              <li><Link to="/nosotros" className="hover:text-primary transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li><Link to="/productos?categoria=herramientas" className="hover:text-primary transition-colors">Herramientas</Link></li>
              <li><Link to="/productos?categoria=electricidad" className="hover:text-primary transition-colors">Electricidad</Link></li>
              <li><Link to="/productos?categoria=plomeria" className="hover:text-primary transition-colors">Plomería</Link></li>
              <li><Link to="/productos?categoria=pintura" className="hover:text-primary transition-colors">Pintura</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +53 5XXX XXXX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                info@ferrehogar.cu
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Tu Provincia, Cuba</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-8 pt-8 text-center text-sm text-secondary-foreground/50">
          <p>© {new Date().getFullYear()} FerreHogar. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
