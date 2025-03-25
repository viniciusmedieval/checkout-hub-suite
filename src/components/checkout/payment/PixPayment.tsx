import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ClipboardCheck, QrCode, Timer, Shield, Info } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatters";
import { PixSecao } from "@/lib/types/database-types";
import { supabase } from "@/integrations/supabase/client";

interface PixPaymentProps {
  productValue: number;
  countdown: number; // seconds
  pixConfig: {
    tipo_chave_pix: string;
    chave_pix: string;
    nome_beneficiario: string;
  } | null;
  pixSecaoId?: number | null;
}

export function PixPayment({ pixConfig, countdown: initialCountdown, productValue, pixSecaoId }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdown);
  const [pixSecao, setPixSecao] = useState<PixSecao | null>(null);

  useEffect(() => {
    const fetchPixSecao = async () => {
      try {
        let query = supabase
          .from("pix_secoes")
          .select("*");
          
        if (pixSecaoId) {
          query = query.eq("id", pixSecaoId);
        } else {
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
      }
    };
    
    fetchPixSecao();
  }, [pixSecaoId]);

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
    if (pixConfig?.chave_pix) {
      navigator.clipboard.writeText(pixConfig.chave_pix);
      setCopied(true);
      toast.success("Chave PIX copiada!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 text-center">
      <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <QrCode size={48} className="text-blue-600" />
      </div>
      <h4 className="text-lg font-semibold text-gray-800 mb-2">
        {pixSecao?.titulo || "Pagamento via Pix"}
      </h4>
      <p className="text-sm text-gray-600 mb-1">{pixConfig?.nome_beneficiario || 'Loja Digital'}</p>
      
      <div className="flex items-center justify-center mb-3 text-sm">
        <Timer size={16} className="text-orange-500 mr-1" />
        <span className="font-medium">Expira em: <strong className="text-orange-500">{formatTime(countdown)}</strong></span>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md p-3 mb-4 flex items-center justify-between">
        <span className="text-sm text-gray-800 font-medium truncate mr-2">
          {pixConfig?.chave_pix || 'exemplo@email.com'}
        </span>
        <Button variant="outline" size="sm" onClick={copyPixCode} className="shrink-0">
          {copied ? <ClipboardCheck size={16} className="mr-1.5" /> : <Copy size={16} className="mr-1.5" />}
          {copied ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
      
      <div className="mb-4 text-left">
        <div className="flex items-center gap-1.5 mb-2">
          <Info size={14} className="text-blue-600" />
          <p className="text-sm font-medium text-gray-800">
            {pixSecao?.info_pagamento || "Informações sobre o pagamento via PIX"}
          </p>
        </div>
        <p className="text-sm text-gray-700 mb-2">
          {pixSecao?.paragrafo_principal || "O pagamento é instantâneo e liberação imediata."}
        </p>
        <p className="text-sm text-gray-700 mb-4">
          {pixSecao?.paragrafo_secundario || "Ao clicar em \"Assinar agora\" você será encaminhado para um ambiente seguro, onde encontrará o passo a passo para realizar o pagamento."}
        </p>
        <p className="text-center text-sm font-medium text-amber-700 mb-2">
          {pixSecao?.texto_valor_vista || "Valor à vista:"} {formatCurrency(productValue)}
        </p>
      </div>
      
      <div className="flex items-center justify-center text-sm text-gray-600 gap-1.5">
        <Shield size={14} className="text-green-600" />
        <p>Pagamento 100% seguro e processado na hora</p>
      </div>
    </div>
  );
}
