import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/hooks/useApi";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const { products = [] } = useProducts();

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          </div>
        </div>
      </div>
      <div className="container py-8">
        <div className="flex gap-4 mb-8 border-b border-border">
          <button onClick={() => setActiveTab("products")} className={`px-4 py-2 ${activeTab === "products" ? "border-b-2 border-primary text-primary" : ""}`}>
            <Package className="w-4 h-4 inline mr-2" /> Produtos ({products.length})
          </button>
          <button onClick={() => setActiveTab("orders")} className={`px-4 py-2 ${activeTab === "orders" ? "border-b-2 border-primary text-primary" : ""}`}>
            <ShoppingCart className="w-4 h-4 inline mr-2" /> Pedidos (0)
          </button>
        </div>
        <div className="grid gap-4">
          {products.map(product => (
            <Card key={product.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-muted-foreground">R$ {Number(product.price).toFixed(2)}</p>
              </div>
              <span className="text-xs bg-accent px-2 py-1 rounded">Estoque: {product.stock}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
