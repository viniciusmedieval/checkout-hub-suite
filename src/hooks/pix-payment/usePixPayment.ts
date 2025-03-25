
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import { toast } from "sonner";

export function usePixPayment() {
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

  // Determinar a cor de fundo a ser usada (default: white)
  const backgroundColor = produto?.background_color || configCheckout?.cor_fundo || "#FFFFFF";
  
  return {
    produto,
    configCheckout,
    loading,
    error,
    countdown,
    copied,
    qrCodeUrl,
    pixKey,
    pixKeyType,
    beneficiaryName,
    pixTitle,
    pixSubtitle,
    pixInstructions,
    pixSecurityMessage,
    primaryColor,
    secondaryColor,
    buttonColor,
    buttonTextColor,
    backgroundColor,
    formatTime,
    copyPixCode,
    handleConfirmPayment,
    handleBackToCheckout
  };
}
