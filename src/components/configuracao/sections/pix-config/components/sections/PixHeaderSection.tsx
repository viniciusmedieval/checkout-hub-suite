
import { ConfigCheckout } from "@/lib/types/database-types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PixHeaderSectionProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PixHeaderSection({ config, handleConfigChange }: PixHeaderSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Título da Página PIX</label>
        <Input
          name="pix_titulo"
          value={config.pix_titulo || "Pagamento via Pix"}
          onChange={handleConfigChange}
          placeholder="Pagamento via Pix"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Subtítulo da Página PIX</label>
        <Input
          name="pix_subtitulo"
          value={config.pix_subtitulo || "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco."}
          onChange={handleConfigChange}
          placeholder="Copie o código ou use a câmera..."
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Instruções para Pagamento</label>
        <Input
          name="pix_instrucoes"
          value={config.pix_instrucoes || "Para realizar o pagamento:"}
          onChange={handleConfigChange}
          placeholder="Para realizar o pagamento:"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Mensagem de Segurança</label>
        <Textarea
          name="pix_mensagem_seguranca"
          value={config.pix_mensagem_seguranca || "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida."}
          onChange={handleConfigChange}
          placeholder="Mensagem sobre segurança do Pix..."
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
}
