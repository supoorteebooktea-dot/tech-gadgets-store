import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Mail, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sucesso() {
  const [orderNumber] = useState(() => `TG${Date.now().toString(36).toUpperCase()}`);

  useEffect(() => {
    // Limpar carrinho do localStorage se existir
    localStorage.removeItem('cart');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">Pedido Confirmado!</h1>
        <p className="text-gray-400 mb-6">Obrigado pela sua compra</p>
        
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <p className="text-gray-400 text-sm">Número do Pedido</p>
          <p className="text-2xl font-bold text-purple-400">{orderNumber}</p>
        </div>

        <div className="space-y-4 text-left mb-8">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">E-mail de Confirmação</p>
              <p className="text-gray-400 text-sm">Você receberá um e-mail com os detalhes do pedido</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Rastreamento</p>
              <p className="text-gray-400 text-sm">O código de rastreio será enviado assim que o pedido for despachado</p>
            </div>
          </div>
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          onClick={() => window.location.href = '/'}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Loja
        </Button>
      </div>
    </div>
  );
}
