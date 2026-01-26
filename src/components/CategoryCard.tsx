import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export function CategoryCard({ id, name, icon, productCount }: CategoryCardProps) {
  return (
    <Link to={`/productos?categoria=${id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-3 transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {productCount} productos
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
