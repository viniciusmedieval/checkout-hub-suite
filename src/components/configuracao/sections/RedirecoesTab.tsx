
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigCheckout } from "@/lib/supabase";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { PaymentStatus } from "@/components/checkout/payment/CardPaymentForm";
import { useEffect } from "react";
import { toast } from "sonner";

interface RedirecoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (status: PaymentStatus) => void;
}

export function RedirecoesTab({ 
  config, 
  handleConfigChange,
  handleStatusChange
}: RedirecoesTabProps) {
  
  useEffect(() => {
    // Verificar se o status salvo é válido
    const currentStatus = config.redirect_card_status as PaymentStatus;
    if (currentStatus && !['analyzing', 'approved', 'rejected'].includes(currentStatus)) {
      console.warn(`Status inválido encontrado: ${currentStatus}. Definindo como 'analyzing'`);
      handleStatusChange('analyzing');
    }
  }, [config.redirect_card_status, handleStatusChange]);
  
  const handleSelectStatus = (value: string) => {
    try {
      if (!['analyzing', 'approved', 'rejected'].includes(value)) {
        throw new Error(`Status inválido: ${value}`);
      }
      
      handleStatusChange(value as PaymentStatus);
      console.log(`Status de redirecionamento alterado para: ${value}`);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error("Erro ao alterar status de redirecionamento");
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração de Redirecionamento</CardTitle>
        <CardDescription>
          Configure para onde os clientes serão redirecionados após uma compra com cartão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Label htmlFor="redirect-status" className="text-sm font-medium mb-2 block">
                Status padrão após pagamento com cartão
              </Label>
              <Select
                value={config.redirect_card_status as string || "analyzing"}
                onValueChange={handleSelectStatus}
              >
                <SelectTrigger className="w-full" id="redirect-status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analyzing">Em análise</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 flex gap-2 text-sm text-blue-700">
            <Info size={20} className="flex-shrink-0 text-blue-500" />
            <div>
              <p className="font-medium">Como funciona:</p>
              <p>Esta configuração define o status de redirecionamento padrão para pagamentos com cartão. 
                 Os clientes serão redirecionados para a página correspondente após finalizar a compra.</p>
              <ul className="list-disc list-inside mt-2">
                <li>Em análise: Mostra que o pagamento está sendo processado</li>
                <li>Aprovado: Mostra que o pagamento foi aprovado</li>
                <li>Rejeitado: Mostra que o pagamento foi rejeitado</li>
              </ul>
              <p className="mt-2">Você também pode configurar redirecionamentos específicos por produto na seção de produtos.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
