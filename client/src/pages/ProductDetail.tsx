import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, ArrowLeft, Check, Truck, Shield } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/useApi";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);
  
  const productId = params?.id ? parseInt(params.id) : 0;
  const { product } = useProducts(false, productId);
  const { products: relatedProducts = [] } = useProducts();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
          <Button onClick={() => setLocation("/")} className="w-full bg-primary">
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddToCart = () => {
    alert(`${quantity} unidade(s) de ${product.name} adicionada(s) ao carrinho!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-4 sticky top-0 z-40">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold text-primary">Tech Gadgets</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="relative h-96 lg:h-full bg-muted rounded-lg overflow-hidden">
            <img src={product.imageUrl || "/images/accessories-flat-lay.jpg"} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground">{product.name}</h1>
            <div className="p-6 bg-card border border-border rounded-lg">
              <span className="text-5xl font-bold text-primary">R$ {Number(product.price).toFixed(2)}</span>
            </div>
            <p className="text-muted-foreground">{product.description}</p>
            
            <div className="flex items-center gap-4 pt-6">
              <div className="flex items-center border border-border rounded-lg">
                <Button variant="ghost" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</Button>
                <span className="px-6 font-semibold">{quantity}</span>
                <Button variant="ghost" onClick={() => setQuantity(quantity + 1)}>+</Button>
              </div>
              <Button className="flex-1 bg-primary py-6" onClick={handleAddToCart}>
                <ShoppingCart className="w-5 h-5 mr-2" /> Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
