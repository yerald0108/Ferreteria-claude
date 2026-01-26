import { Product } from '@/lib/store';

export const categories = [
  { id: 'herramientas', name: 'Herramientas', icon: '🔧' },
  { id: 'electricidad', name: 'Electricidad', icon: '⚡' },
  { id: 'plomeria', name: 'Plomería', icon: '🔩' },
  { id: 'pintura', name: 'Pintura', icon: '🎨' },
  { id: 'cerrajeria', name: 'Cerrajería', icon: '🔐' },
  { id: 'miscelaneas', name: 'Misceláneas', icon: '📦' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Martillo de Carpintero 16oz',
    price: 850,
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&h=300&fit=crop',
    category: 'herramientas',
    description: 'Martillo profesional de carpintero con mango de fibra de vidrio y cabeza de acero forjado.',
    stock: 15
  },
  {
    id: '2',
    name: 'Taladro Percutor 750W',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=300&fit=crop',
    category: 'herramientas',
    description: 'Taladro percutor de alta potencia ideal para trabajos en concreto y mampostería.',
    stock: 8
  },
  {
    id: '3',
    name: 'Juego de Destornilladores 12 piezas',
    price: 650,
    image: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?w=400&h=300&fit=crop',
    category: 'herramientas',
    description: 'Set completo de destornilladores con puntas Phillips y planas de diferentes tamaños.',
    stock: 20
  },
  {
    id: '4',
    name: 'Cable Eléctrico THW 12 AWG (100m)',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    category: 'electricidad',
    description: 'Cable de cobre THW calibre 12 para instalaciones eléctricas residenciales.',
    stock: 25
  },
  {
    id: '5',
    name: 'Interruptor Doble con Placa',
    price: 180,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    category: 'electricidad',
    description: 'Interruptor doble de pared con placa decorativa color blanco.',
    stock: 50
  },
  {
    id: '6',
    name: 'Tubo PVC 4" x 6m',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop',
    category: 'plomeria',
    description: 'Tubo de PVC de 4 pulgadas para drenaje y desagüe, 6 metros de largo.',
    stock: 30
  },
  {
    id: '7',
    name: 'Llave Stillson 14"',
    price: 950,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
    category: 'plomeria',
    description: 'Llave Stillson profesional de 14 pulgadas para trabajos de plomería.',
    stock: 12
  },
  {
    id: '8',
    name: 'Pintura Esmalte Blanco 1 Galón',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=300&fit=crop',
    category: 'pintura',
    description: 'Pintura esmalte blanco brillante de alta durabilidad para interiores y exteriores.',
    stock: 18
  },
  {
    id: '9',
    name: 'Brocha 4 Pulgadas',
    price: 280,
    image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop',
    category: 'pintura',
    description: 'Brocha profesional de 4 pulgadas con cerdas naturales.',
    stock: 40
  },
  {
    id: '10',
    name: 'Candado de Seguridad 50mm',
    price: 450,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
    category: 'cerrajeria',
    description: 'Candado de alta seguridad con cuerpo de acero y 3 llaves incluidas.',
    stock: 35
  },
  {
    id: '11',
    name: 'Cerradura de Embutir',
    price: 1100,
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop',
    category: 'cerrajeria',
    description: 'Cerradura de embutir para puertas de madera con 3 golpes de seguridad.',
    stock: 22
  },
  {
    id: '12',
    name: 'Cinta Aislante Negra (20m)',
    price: 85,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    category: 'miscelaneas',
    description: 'Cinta aislante eléctrica de alta calidad, resistente al calor.',
    stock: 100
  },
];
