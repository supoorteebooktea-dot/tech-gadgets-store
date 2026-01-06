import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Zap, Truck, Shield, ArrowRight, ShoppingCart, X, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  specifications?: Record<string, string>;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Carregar produtos da API
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao carregar produtos:', err);
        setLoading(false);
      });
  }, []);

  const benefits = [
    { icon: Zap, title: "Entrega Rápida", description: "Receba em até 7 dias úteis" },
    { icon: Shield, title: "Garantia Completa", description: "2 anos de cobertura total" },
    { icon: Truck, title: "Frete Grátis", description: "Acima de R$ 200" }
  ];

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl
          }))
        })
      });
      
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar checkout. Tente novamente.');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const freeShippingProgress = Math.min((cartTotal / 200) * 100, 100);
  const remainingForFreeShipping = Math.max(200 - cartTotal, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Tech Gadgets
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#products" className="text-gray-300 hover:text-purple-400 transition">Produtos</a>
            <a href="#benefits" className="text-gray-300 hover:text-purple-400 transition">Benefícios</a>
          </div>
          <Button
            variant="outline"
            className="relative border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>

        {/* Cart Dropdown */}
        {showCart && (
          <div className="absolute right-4 top-full mt-2 w-96 bg-slate-800 border border-purple-500/30 rounded-xl shadow-2xl p-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-lg font-semibold text-white mb-4">Carrinho</h3>
            
            {/* Barra de Frete Grátis */}
            {cartTotal > 0 && cartTotal < 200 && (
              <div className="mb-4 p-3 bg-purple-500/10 rounded-lg">
                <p className="text-sm text-purple-300 mb-2">
                  Faltam <span className="font-bold">R$ {remainingForFreeShipping.toFixed(2)}</span> para frete grátis!
                </p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}
            {cartTotal >= 200 && (
              <div className="mb-4 p-3 bg-green-500/10 rounded-lg">
                <p className="text-sm text-green-400">🎉 Parabéns! Você ganhou frete grátis!</p>
              </div>
            )}

            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Carrinho vazio</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-center bg-slate-700/50 p-2 rounded-lg">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-purple-400 text-sm">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-white w-6 text-center">{item.quantity}</span>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-gray-400" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400" onClick={() => removeFromCart(item.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <div className="flex justify-between text-white mb-4">
                  <span>Total:</span>
                  <span className="font-bold text-xl">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-6">
          ✨ Tecnologia Premium
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Tecnologia de Ponta<br />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ao Seu Alcance
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Descubra uma curadoria exclusiva de gadgets inovadores que transformam seu dia a dia.
        </p>
        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8">
          Explorar Produtos <ArrowRight className="ml-2 w-5 h-5" />
        </Button>

        <div className="flex justify-center gap-12 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">1000+</div>
            <p className="text-gray-400">Clientes Satisfeitos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">4.9★</div>
            <p className="text-gray-400">Avaliação Média</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">24h</div>
            <p className="text-gray-400">Suporte Ativo</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <Card key={idx} className="bg-slate-800/50 border-purple-500/20 p-6 text-center hover:bg-slate-800/70 transition">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Nossos Produtos</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Selecionamos os melhores gadgets tecnológicos para você
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-400 mt-4">Carregando produtos...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className="bg-slate-800/50 border-purple-500/20 overflow-hidden group hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.originalPrice > product.price && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-purple-400 uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-white font-semibold mt-1 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-400 text-sm">{product.rating}</span>
                    <span className="text-gray-500 text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      {product.originalPrice > product.price && (
                        <span className="text-gray-500 line-through text-sm mr-2">
                          R$ {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xl font-bold text-purple-400">
                        R$ {product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-3 bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white border border-purple-500/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelectedProduct(null)}>
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="relative">
              <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full aspect-video object-cover" />
              <Button 
                variant="ghost" 
                className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedProduct(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <span className="text-purple-400 text-sm uppercase tracking-wider">{selectedProduct.category}</span>
              <h2 className="text-2xl font-bold text-white mt-2">{selectedProduct.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-400">{selectedProduct.rating}</span>
                <span className="text-gray-500">({selectedProduct.reviews} avaliações)</span>
              </div>
              <p className="text-gray-300 mt-4">{selectedProduct.description}</p>
              
              {selectedProduct.specifications && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Especificações</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <div key={key} className="bg-slate-700/50 p-2 rounded">
                        <span className="text-gray-400 text-sm">{key}</span>
                        <p className="text-white text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                <div>
                  {selectedProduct.originalPrice > selectedProduct.price && (
                    <span className="text-gray-500 line-through mr-2">
                      R$ {selectedProduct.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-purple-400">
                    R$ {selectedProduct.price.toFixed(2)}
                  </span>
                </div>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-purple-500/20 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Tech Gadgets
          </div>
          <p className="text-gray-400 mb-6">Gadgets que transformam seu dia a dia</p>
          <p className="text-gray-500 text-sm">© 2026 Tech Gadgets Store. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
