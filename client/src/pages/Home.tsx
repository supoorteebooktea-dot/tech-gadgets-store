import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Truck, Shield, ArrowRight, ShoppingCart, User, LogOut } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { useProducts } from "@/hooks/useApi";
import { useLocation } from "wouter";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery] = useState("");

  const { products = [] } = useProducts();
  const { products: featuredProducts = [] } = useProducts(true);

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? Number(product.price) : 0) * item.quantity;
  }, 0);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">Tech Gadgets</div>
          <div className="flex gap-3 items-center">
            <Button variant="outline" size="sm" onClick={() => setShowCart(!showCart)} className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{cart.length}</span>}
            </Button>
            {isAuthenticated ? (
              <div className="flex gap-2 items-center">
                <span className="text-sm hidden sm:inline">{user?.name || 'Usuário'}</span>
                <Button variant="outline" size="sm" onClick={() => logout()}><LogOut className="w-4 h-4" /></Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => window.location.href = getLoginUrl()}><User className="w-4 h-4 mr-1" /> Entrar</Button>
            )}
          </div>
        </div>
      </nav>

      <section className="container py-20 text-center space-y-8">
        <h1 className="text-5xl font-bold leading-tight">Tecnologia de Ponta ao Seu Alcance</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Descubra gadgets inovadores que transformam seu dia a dia.</p>
        <Button size="lg" className="bg-primary px-8 py-6 text-lg">Explorar Produtos <ArrowRight className="ml-2" /></Button>
      </section>

      <section className="container py-20 grid md:grid-cols-3 gap-8">
        {featuredProducts.slice(0, 3).map(product => (
          <Card key={product.id} className="p-6 space-y-4 hover:shadow-xl transition cursor-pointer" onClick={() => setLocation(`/product/${product.id}`)}>
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img src={product.imageUrl || "/images/tech-lifestyle.jpg"} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-bold">{product.name}</h3>
            <p className="text-primary font-bold text-2xl">R$ {Number(product.price).toFixed(2)}</p>
            <Button className="w-full bg-primary">Ver Detalhes</Button>
          </Card>
        ))}
      </section>
    </div>
  );
}
