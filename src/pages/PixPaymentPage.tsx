
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import { formatCurrency } from "@/utils/formatters";
import { QrCode, Copy, ClipboardCheck, Timer, ArrowRight, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckoutLoading } from "@/components/checkout/CheckoutLoading";
import { CheckoutError } from "@/components/checkout/CheckoutError";

const PixPaymentPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);
  
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(false);
  
  // Get qrCodeUrl from product or config
  const qrCodeUrl = produto?.qr_code_pix_url || configCheckout?.qr_code_pix_url || 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(produto?.chave_pix || configCheckout?.chave_pix_global || '')}`;
  
  // Get PIX data from product or config
  const pixKey = produto?.chave_pix || configCheckout?.chave_pix_global || '';
  const pixKeyType = produto?.tipo_chave_pix || configCheckout?.tipo_chave_pix_global || 'email';
  const beneficiaryName = produto?.nome_beneficiario || configCheckout?.nome_beneficiario_pix || 'Loja Digital';
  
  // Get custom texts from config
  const pixTitle = configCheckout?.pix_titulo || 'Pagamento via Pix';
  const pixSubtitle = configCheckout?.pix_subtitulo || 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.';
  const pixInstructions = configCheckout?.pix_instrucoes || 'Para realizar o pagamento:';
  const pixSecurityMessage = configCheckout?.pix_mensagem_seguranca || 
    'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.';
  
  // Custom colors
  const primaryColor = configCheckout?.cor_primaria_pix || "#1E40AF";
  const secondaryColor = configCheckout?.cor_secundaria_pix || "#DBEAFE";
  const buttonColor = configCheckout?.cor_botao_pix || configCheckout?.cor_botao || "#8B5CF6";
  const buttonTextColor = configCheckout?.cor_texto_botao_pix || configCheckout?.cor_texto_botao || "#FFFFFF";
  
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleConfirmPayment = () => {
    setConfirmedPayment(true);
    toast.success("Pagamento confirmado! Verificando...");
    setTimeout(() => {
      navigate(`/payment-status/${slug}/analyzing`);
    }, 2000);
  };
  
  const handleBackToCheckout = () => {
    navigate(`/checkout/${slug}`);
  };

  if (loading) {
    return <CheckoutLoading />;
  }

  if (error || !produto) {
    return <CheckoutError error={error} />;
  }

  // Determinar a cor de fundo a ser usada (default: white)
  const backgroundColor = produto.background_color || configCheckout?.cor_fundo || "#FFFFFF";
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header */}
      <CheckoutHeader produto={produto} configCheckout={configCheckout} />

      {/* Main content */}
      <div className="flex-grow flex justify-center py-6 px-4">
        <div className="w-full max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="p-4 text-center" 
              style={{ backgroundColor: secondaryColor, color: primaryColor }}
            >
              <h1 className="text-xl font-semibold">{pixTitle}</h1>
              <p className="text-sm mt-1">{beneficiaryName}</p>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4 text-center">{pixSubtitle}</p>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
                {/* QR Code */}
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 object-contain"
                  />
                </div>
                
                {/* PIX Info */}
                <div className="space-y-4 w-full max-w-xs">
                  <div className="text-center mb-2">
                    <p className="text-sm font-medium">Aqui está o PIX copia e cola</p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center justify-between">
                    <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-sm">
                      {pixKey}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={copyPixCode} 
                      className="ml-2 shrink-0"
                      style={{ color: primaryColor, borderColor: primaryColor }}
                    >
                      {copied ? <ClipboardCheck size={16} className="mr-1.5" /> : <Copy size={16} className="mr-1.5" />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleConfirmPayment}
                  >
                    Confirmar pagamento
                  </Button>
                  
                  <div className="flex items-center justify-center bg-blue-50 rounded-md p-2 text-sm border border-blue-100">
                    <Timer size={16} className="text-orange-500 mr-2" />
                    <span>Faltam <strong className="text-orange-500">{formatTime(countdown)}</strong> minutos para o pagamento expirar...</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="text-gray-700 font-medium mb-3">{pixInstructions}</h3>
                
                <ol className="space-y-4 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-700">1</span>
                    <span>Abra o aplicativo do seu banco;</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-700">2</span>
                    <span>Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code;</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-gray-700">3</span>
                    <span>Confirme as informações e finalize o pagamento.</span>
                  </li>
                </ol>
                
                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-4 flex gap-2 text-sm text-yellow-800">
                  <div className="shrink-0 mt-0.5">
                    <Info size={16} className="text-yellow-600" />
                  </div>
                  <p>{pixSecurityMessage}</p>
                </div>
                
                <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer list-none text-gray-700 font-medium">
                      <span>Saiba mais</span>
                      <span className="transition group-open:rotate-180">
                        <ArrowRight size={16} />
                      </span>
                    </summary>
                    <div className="mt-3 space-y-4">
                      <div className="flex flex-wrap justify-around gap-2 pt-2">
                        <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                          <p className="text-xs">Nubank</p>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                          <p className="text-xs">Itaú</p>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                          <p className="text-xs">Bradesco</p>
                        </div>
                        <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                          <p className="text-xs">Santander</p>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
            <h2 className="text-lg font-medium text-gray-800">Sua Compra</h2>
            
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
              <div className="flex-1">
                <p className="text-xs text-gray-500">Produto Digital</p>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-base font-medium text-gray-800">{produto.nome}</p>
                    {produto.descricao && (
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{produto.descricao}</p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(produto.valor)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
              <p className="text-sm text-gray-500">Total:</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(produto.valor)}</p>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBackToCheckout}
              className="w-full"
            >
              Voltar para o checkout
            </Button>
          </div>
          
          <div className="flex items-center justify-center text-sm text-gray-600 gap-1.5">
            <Shield size={14} className="text-green-600" />
            <p>{configCheckout?.mensagem_rodape || "Pagamento 100% seguro e processado na hora"}</p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <CheckoutFooter configCheckout={configCheckout} />
    </div>
  );
};

export default PixPaymentPage;
