
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ClipboardCheck, Timer } from "lucide-react";
import { toast } from "sonner";

interface PixQRCodeSectionProps {
  qrCodeUrl: string;
  pixKey: string;
  countdown: number;
  formatTime: (seconds: number) => string;
  primaryColor: string;
  onConfirmPayment: () => void;
}

export function PixQRCodeSection({
  qrCodeUrl,
  pixKey,
  countdown,
  formatTime,
  primaryColor,
  onConfirmPayment
}: PixQRCodeSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 3000);
  };

  return (
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
          onClick={onConfirmPayment}
        >
          Confirmar pagamento
        </Button>
        
        <div className="flex items-center justify-center bg-blue-50 rounded-md p-2 text-sm border border-blue-100">
          <Timer size={16} className="text-orange-500 mr-2" />
          <span>Faltam <strong className="text-orange-500">{formatTime(countdown)}</strong> minutos para o pagamento expirar...</span>
        </div>
      </div>
    </div>
  );
}
