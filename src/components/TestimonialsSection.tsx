// src/components/TestimonialsSection.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar?: string;
  date: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    location: 'Centro Habana',
    rating: 5,
    comment: 'Excelente servicio. Pedí herramientas para mi taller y llegaron en perfecto estado. La entrega fue rápida y el precio muy competitivo.',
    date: 'Hace 2 semanas',
    verified: true,
  },
  {
    id: 2,
    name: 'María González',
    location: 'Playa',
    rating: 5,
    comment: 'Muy contenta con mi compra. Necesitaba materiales de plomería urgente y me los trajeron el mismo día. Totalmente recomendado.',
    date: 'Hace 1 mes',
    verified: true,
  },
  {
    id: 3,
    name: 'Jorge Fernández',
    location: 'Marianao',
    rating: 4,
    comment: 'Buena variedad de productos y precios justos. El proceso de compra es muy sencillo. Solo mejoraría los horarios de entrega.',
    date: 'Hace 3 semanas',
    verified: true,
  },
  {
    id: 4,
    name: 'Ana López',
    location: 'La Lisa',
    rating: 5,
    comment: 'Primera vez que compro online en Cuba y la experiencia fue increíble. Los productos llegaron bien empaquetados y el personal muy amable.',
    date: 'Hace 1 semana',
    verified: true,
  },
  {
    id: 5,
    name: 'Luis Martínez',
    location: 'Cerro',
    rating: 5,
    comment: 'Trabajo en construcción y ahora hago todos mis pedidos aquí. Me ahorro tiempo y el catálogo es muy completo. ¡Excelente servicio!',
    date: 'Hace 4 días',
    verified: true,
  },
];

export function TestimonialsSection() {
  const plugin = Autoplay({ delay: 5000, stopOnInteraction: true });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-4">
            <Quote className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Miles de cubanos confían en nosotros para sus proyectos. Lee sus experiencias.
          </p>
        </div>

        {/* Carousel */}
        <div className="max-w-6xl mx-auto">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[plugin]}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Rating */}
                      <div className="flex gap-1 mb-4">{renderStars(testimonial.rating)}</div>

                      {/* Comment */}
                      <blockquote className="flex-1 mb-6">
                        <p className="text-muted-foreground italic leading-relaxed">
                          "{testimonial.comment}"
                        </p>
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center gap-3 pt-4 border-t">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(testimonial.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              {testimonial.name}
                            </p>
                            {testimonial.verified && (
                              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                <svg
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                Verificado
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.location} · {testimonial.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4 md:-left-12" />
            <CarouselNext className="-right-4 md:-right-12" />
          </Carousel>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          <div className="text-center p-4 bg-card rounded-lg border">
            <p className="text-3xl font-bold text-primary">500+</p>
            <p className="text-sm text-muted-foreground mt-1">Clientes Satisfechos</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <p className="text-3xl font-bold text-primary">4.9</p>
            <p className="text-sm text-muted-foreground mt-1">Calificación Promedio</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <p className="text-3xl font-bold text-primary">1000+</p>
            <p className="text-sm text-muted-foreground mt-1">Pedidos Entregados</p>
          </div>
          <div className="text-center p-4 bg-card rounded-lg border">
            <p className="text-3xl font-bold text-primary">98%</p>
            <p className="text-sm text-muted-foreground mt-1">Recomendación</p>
          </div>
        </div>
      </div>
    </section>
  );
}