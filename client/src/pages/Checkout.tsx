import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/useApi";

export default function Checkout() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cart] = useState<Array<{ id: number; quantity: number }>>([]);
  const [formData, setFormData] = useState({
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { products = [] } = useProducts();

  if (!isAuthenticated && false) { // Desativado para demonstração
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acesso Necessário</h2>
          <Button onClick={() => setLocation("/")} className="w-full bg-primary">
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? Number(product.price) : 0) * item.quantity;
  }, 0);

  const total = cartTotal + (cartTotal > 200 ? 0 : 20) + (cartTotal * 0.1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert("Checkout processado!");
      setIsLoading(false);
      setLocation("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-4">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" onClick={() => setLocation("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>
      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input placeholder="Rua" className="w-full p-2 border rounded" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} required />
                  <input placeholder="Número" className="w-full p-2 border rounded" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : "Finalizar Pedido"}
                </Button>
              </form>
            </Card>
          </div>
          <Card className="p-6 h-fit">
            <h3 className="font-bold mb-4">Resumo</h3>
            <div className="flex justify-between font-bold text-lg text-primary">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
