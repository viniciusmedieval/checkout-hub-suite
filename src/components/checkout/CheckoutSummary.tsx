import { useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingCart, Shield, Copy, ClipboardCheck, QrCode } from "lucide-react";
import { Produto, supabase } from "@/lib/supabase";
import { 
  formatCurrency, 
  formatCardNumber, 
  formatCardExpiry, 
  getInstallmentOptions 
} from "@/utils/formatters";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CheckoutSummaryProps {
  produto: Produto;
}

interface PixConfig {
  tipo_chave_pix: string;
  chave_pix: string;
  nome_beneficiario: string;
}

export function CheckoutSummary({ produto }: CheckoutSummaryProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [pixConfig, setPixConfig] = useState<PixConfig | null>(null);
  const [copied, setCopied] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [installments, setInstallments] = useState("1");
  const [loading, setLoading] = useState(false);
  
  const installmentOptions = getInstallmentOptions(produto.valor);

  useEffect(() => {
    const fetchPixConfig = async () => {
      try {
        let { data: productPixConfig, error } = await supabase
          .from("pix_config")
          .select("*")
          .eq("produto_id", produto.id)
          .single();
        
        if (error || !productPixConfig) {
          const { data: globalConfig } = await supabase
            .from("pix_config")
            .select("*")
            .eq("is_global", true)
            .single();
          
          if (globalConfig) {
            setPixConfig(globalConfig);
          } else {
            setPixConfig({
              tipo_chave_pix: produto.tipo_chave_pix || 'email',
              chave_pix: produto.chave_pix || 'exemplo@email.com',
              nome_beneficiario: produto.nome_beneficiario || 'Loja Digital'
            });
          }
        } else {
          setPixConfig(productPixConfig);
        }
      } catch (error) {
        console.error("Error fetching PIX config:", error);
        setPixConfig({
          tipo_chave_pix: 'email',
          chave_pix: 'exemplo@email.com',
          nome_beneficiario: 'Loja Digital'
        });
      }
    };

    fetchPixConfig();
  }, [produto.id, produto.tipo_chave_pix, produto.chave_pix, produto.nome_beneficiario]);

  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardNumber(formatCardNumber(value));
  };

  const handleCardExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardExpiry(formatCardExpiry(value));
  };

  const handleCardCVVChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCardCVV(value);
    }
  };

  const copyPixCode = () => {
    if (pixConfig?.chave_pix) {
      navigator.clipboard.writeText(pixConfig.chave_pix);
      setCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleComprar = async () => {
    setLoading(true);

    setTimeout(() => {
      toast.success("Sua compra foi processada com sucesso!");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="checkout-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <CreditCard size={16} className="text-blue-600" />
            </div>
            <h3 className="checkout-heading">Pagamento</h3>
          </div>
          
          <Tabs defaultValue="card" className="w-full" onValueChange={(value) => setPaymentMethod(value as 'card' | 'pix')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="card" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <CreditCard size={16} className="mr-2" />
                Cartão de Crédito
              </TabsTrigger>
              <TabsTrigger value="pix" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <QrCode size={16} className="mr-2" />
                Pix
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cardNumber" className="checkout-label">Número do cartão</label>
                  <Input 
                    id="cardNumber" 
                    placeholder="0000 0000 0000 0000" 
                    className="checkout-input" 
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="cardName" className="checkout-label">Nome no cartão</label>
                  <Input 
                    id="cardName" 
                    placeholder="Nome como está impresso no cartão" 
                    className="checkout-input" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="cardExpiry" className="checkout-label">Vencimento</label>
                    <Input 
                      id="cardExpiry" 
                      placeholder="MM/AA" 
                      className="checkout-input" 
                      value={cardExpiry}
                      onChange={handleCardExpiryChange}
                      maxLength={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="cardCVV" className="checkout-label">CVV</label>
                    <Input 
                      id="cardCVV" 
                      placeholder="123" 
                      className="checkout-input" 
                      value={cardCVV}
                      onChange={handleCardCVVChange}
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="installments" className="checkout-label">Parcelas</label>
                  <select 
                    id="installments" 
                    className="w-full h-10 bg-[hsl(var(--checkout-input-bg))] border border-[hsl(var(--checkout-border))] rounded-md px-3 text-[hsl(var(--checkout-text))]"
                    value={installments}
                    onChange={(e) => setInstallments(e.target.value)}
                  >
                    {installmentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pix">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <QrCode size={48} className="text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Chave Pix</h4>
                <p className="text-sm text-gray-600 mb-3">{pixConfig?.nome_beneficiario || 'Loja Digital'}</p>
                
                <div className="bg-white border border-gray-200 rounded-md p-3 mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-800 font-medium truncate mr-2">
                    {pixConfig?.chave_pix || 'exemplo@email.com'}
                  </span>
                  <Button variant="outline" size="sm" onClick={copyPixCode} className="shrink-0">
                    {copied ? <ClipboardCheck size={16} className="mr-1.5" /> : <Copy size={16} className="mr-1.5" />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600">
                  Após realizar o pagamento via PIX, sua compra será confirmada em instantes.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="checkout-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
              <ShoppingCart size={16} className="text-blue-600" />
            </div>
            <h3 className="checkout-heading">Resumo da Compra</h3>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                <img 
                  src={produto.imagem_url || 'https://placehold.co/100x100/f1f5f9/64748b?text=Produto'} 
                  alt={produto.nome} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/100x100/f1f5f9/64748b?text=Produto';
                  }}
                />
              </div>
              <div>
                <p className="text-xs text-gray-500">Produto Digital</p>
                <p className="text-base font-medium text-gray-800">{produto.nome}</p>
                <p className="text-lg font-bold text-blue-600">{formatCurrency(produto.valor)}</p>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleComprar}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 text-base h-auto"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </>
            ) : (
              'Assinar agora'
            )}
          </Button>
          
          <div className="flex items-center justify-center mt-4 text-xs text-gray-500 gap-1.5">
            <Shield size={14} />
            <span>Quase 10.946 usuários ativos finalizaram a compra neste momento.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
