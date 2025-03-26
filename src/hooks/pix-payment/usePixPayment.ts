import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCheckoutData } from "@/hooks/useCheckoutData";
import { toast } from "sonner";
import { PixSecao } from "@/lib/types/database-types";
import { supabase } from "@/integrations/supabase/client";

export function usePixPayment() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { produto, configCheckout, loading, error } = useCheckoutData(slug);
  
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState(false);
  const [confirmedPayment, setConfirmedPayment] = useState(false);
  const [pixSecao, setPixSecao] = useState<PixSecao | null>(null);
  const [loadingPixSecao, setLoadingPixSecao] = useState(true);
  
  // Get qrCodeUrl from product or config
  const qrCodeUrl = produto?.qr_code_pix_url || configCheckout?.qr_code_pix_url || 
    `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(produto?.chave_pix || configCheckout?.chave_pix_global || '')}`;
  
  // Get PIX data from product or config
  const pixKey = produto?.chave_pix || configCheckout?.chave_pix_global || '';
  const pixKeyType = produto?.tipo_chave_pix || configCheckout?.tipo_chave_pix_global || 'email';
  const beneficiaryName = produto?.nome_beneficiario || configCheckout?.nome_beneficiario_pix || 'Loja Digital';
  
  // Load PIX section data
  useEffect(() => {
    const fetchPixSecao = async () => {
      if (!configCheckout) return;
      
      try {
        setLoadingPixSecao(true);
        let query = supabase.from("pix_secoes").select("*");
        
        // If config has a specific section ID, use it (check if property exists first)
        if (configCheckout.pix_secao_id !== undefined && configCheckout.pix_secao_id !== null) {
          query = query.eq("id", configCheckout.pix_secao_id);
        } else {
          // Otherwise get the first active section
          query = query.eq("ativo", true).order("id").limit(1);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Erro ao carregar seção PIX:", error);
        } else if (data && data.length > 0) {
          setPixSecao(data[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar seção PIX:", error);
      } finally {
        setLoadingPixSecao(false);
      }
    };
    
    if (configCheckout) {
      fetchPixSecao();
    }
  }, [configCheckout]);
  
  // Get custom texts from config or section
  const pixTitle = pixSecao?.titulo || configCheckout?.pix_titulo || 'Pagamento via Pix';
  const pixSubtitle = pixSecao?.subtitulo || configCheckout?.pix_subtitulo || 'Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.';
  const pixInstructions = configCheckout?.pix_instrucoes || 'Para realizar o pagamento:';
  const pixSecurityMessage = configCheckout?.pix_mensagem_seguranca || 
    'Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.';
  
  // Get button text from section
  const pixButtonText = pixSecao?.botao_texto || 'Assine agora';
  
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
    loading: loading || loadingPixSecao,
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
    pixButtonText,
    pixSecao,
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
