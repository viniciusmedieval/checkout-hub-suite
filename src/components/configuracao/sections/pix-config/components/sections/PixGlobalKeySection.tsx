
import { ConfigCheckout } from "@/lib/types/database-types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PixGlobalKeySectionProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export function PixGlobalKeySection({ 
  config, 
  handleConfigChange, 
  handleSelectChange 
}: PixGlobalKeySectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo da Chave PIX Global</label>
          <Select 
            value={config.tipo_chave_pix_global || "email"}
            onValueChange={(value) => handleSelectChange('tipo_chave_pix_global', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="cnpj">CNPJ</SelectItem>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="telefone">Telefone</SelectItem>
              <SelectItem value="aleatoria">Chave Aleatória</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Chave PIX Global</label>
          <Input
            name="chave_pix_global"
            value={config.chave_pix_global || ""}
            onChange={handleConfigChange}
            placeholder="Sua chave PIX"
          />
          <p className="text-xs text-gray-500">Essa chave será usada quando o produto não tiver uma chave específica.</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Nome do Beneficiário PIX</label>
        <Input
          name="nome_beneficiario_pix"
          value={config.nome_beneficiario_pix || ""}
          onChange={handleConfigChange}
          placeholder="Nome que aparecerá como beneficiário"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">URL da Imagem do QR Code (opcional)</label>
        <Input
          name="qr_code_pix_url"
          value={config.qr_code_pix_url || ""}
          onChange={handleConfigChange}
          placeholder="https://exemplo.com/qrcode.png"
        />
        <p className="text-xs text-gray-500">Se não for fornecido, o QR code será gerado automaticamente.</p>
      </div>
    </div>
  );
}
