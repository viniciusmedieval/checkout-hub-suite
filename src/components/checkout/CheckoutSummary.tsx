
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingCart, Shield } from "lucide-react";
import { Produto } from "@/lib/supabase";
import { toast } from "sonner";

interface CheckoutSummaryProps {
  produto: Produto;
}

export function CheckoutSummary({ produto }: CheckoutSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  
  const handleComprar = () => {
    toast.success("Compra realizada com sucesso!");
  };

  return (
    <div className="space-y-6">
      {/* Payment section */}
      <Card className="border border-[#353535] bg-[#1D1D1D]">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#FF914D]" />
              <h3 className="text-sm font-medium">Pagamento</h3>
            </div>
            <span className="text-xs text-gray-400">Cartão de crédito</span>
          </div>
          
          <div className="flex items-center mb-4 gap-4">
            <button 
              className={`flex-1 py-2 text-center rounded-md text-sm font-medium transition-colors ${paymentMethod === 'card' ? 'bg-[#FF914D] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#353535]'}`}
              onClick={() => setPaymentMethod('card')}
            >
              <CreditCard size={16} className="inline-block mr-2" />
              Cartão
            </button>
            <button 
              className={`flex-1 py-2 text-center rounded-md text-sm font-medium transition-colors ${paymentMethod === 'pix' ? 'bg-[#FF914D] text-white' : 'bg-[#2A2A2A] text-gray-400 hover:bg-[#353535]'}`}
              onClick={() => setPaymentMethod('pix')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2">
                <path d="M7.5 4.5L2 10L7.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 4.5L22 10L16.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pix
            </button>
          </div>
          
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="cardNumber" className="text-xs text-gray-400">Número do cartão</label>
                <Input 
                  id="cardNumber" 
                  placeholder="Digite o número do seu cartão" 
                  className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="cardName" className="text-xs text-gray-400">Nome no cartão</label>
                <Input 
                  id="cardName" 
                  placeholder="Digite o nome impresso no cartão" 
                  className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="cardExpiry" className="text-xs text-gray-400">Vencimento</label>
                  <Input 
                    id="cardExpiry" 
                    placeholder="MM/AA" 
                    className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cardCVV" className="text-xs text-gray-400">CVV</label>
                  <Input 
                    id="cardCVV" 
                    placeholder="123" 
                    className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="installments" className="text-xs text-gray-400">Parcelas</label>
                  <select 
                    id="installments" 
                    className="w-full h-10 bg-[#2A2A2A] border border-[#353535] rounded-md px-3 text-white"
                  >
                    <option value="1">1x de R$ {produto.valor.toFixed(2)}</option>
                    <option value="2">2x de R$ {(produto.valor / 2).toFixed(2)}</option>
                    <option value="3">3x de R$ {(produto.valor / 3).toFixed(2)}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cpfCartao" className="text-xs text-gray-400">CPF do titular</label>
                  <Input 
                    id="cpfCartao" 
                    placeholder="Apenas números" 
                    className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === 'pix' && (
            <div className="text-center p-4 bg-[#2A2A2A] rounded-md">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2">
                <path d="M7.5 4.5L2 10L7.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16.5 4.5L22 10L16.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm mb-2">Gere o QR Code para pagamento</p>
              <button className="bg-[#FF914D] text-white px-4 py-2 rounded-md text-sm">
                Gerar QR Code
              </button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Order summary */}
      <Card className="border border-[#353535] bg-[#1D1D1D]">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart size={18} className="text-[#FF914D]" />
            <h3 className="text-sm font-medium">Sua Compra</h3>
            <span className="ml-auto text-xs font-medium text-[#FF914D]">1 item • R$ {produto.valor.toFixed(2)}</span>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-[#2A2A2A] rounded-md mb-4">
            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <img 
                src={produto.imagem_url || 'https://placehold.co/100x100/333/FFF'} 
                alt={produto.nome} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-gray-400">Produto Digital - Checkout Card</p>
              <p className="text-sm font-medium">{produto.nome}</p>
              <p className="text-[#FF914D] text-sm font-bold">R$ {produto.valor.toFixed(2)}</p>
            </div>
          </div>
          
          <Button 
            onClick={handleComprar}
            className="w-full bg-[#04D361] hover:bg-[#03b050] text-white font-bold py-3 text-lg"
          >
            Finalizar agora
          </Button>
          
          <div className="flex items-center justify-center mt-4 text-xs text-gray-400 gap-1">
            <Shield size={14} />
            <span>Compra 100% segura. Proteção garantida na hora da compra.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
