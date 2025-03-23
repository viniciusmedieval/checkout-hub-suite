
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ClipboardCheck, QrCode } from "lucide-react";
import { toast } from "sonner";

interface PixPaymentProps {
  pixConfig: {
    tipo_chave_pix: string;
    chave_pix: string;
    nome_beneficiario: string;
  } | null;
}

export function PixPayment({ pixConfig }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);

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
  );
}
