
import { ConfigCheckout } from "@/lib/types/database-types";
import { Input } from "@/components/ui/input";

interface PixAppearanceSectionProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function PixAppearanceSection({ config, handleConfigChange }: PixAppearanceSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Aparência da Página PIX</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor Primária</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              name="cor_primaria_pix"
              value={config.cor_primaria_pix || "#1E40AF"}
              onChange={handleConfigChange}
              className="w-10 h-10 rounded overflow-hidden cursor-pointer"
            />
            <Input
              name="cor_primaria_pix"
              value={config.cor_primaria_pix || "#1E40AF"}
              onChange={handleConfigChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor Secundária</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              name="cor_secundaria_pix"
              value={config.cor_secundaria_pix || "#DBEAFE"}
              onChange={handleConfigChange}
              className="w-10 h-10 rounded overflow-hidden cursor-pointer"
            />
            <Input
              name="cor_secundaria_pix"
              value={config.cor_secundaria_pix || "#DBEAFE"}
              onChange={handleConfigChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor do Botão PIX</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              name="cor_botao_pix"
              value={config.cor_botao_pix || config.cor_botao || "#8B5CF6"}
              onChange={handleConfigChange}
              className="w-10 h-10 rounded overflow-hidden cursor-pointer"
            />
            <Input
              name="cor_botao_pix"
              value={config.cor_botao_pix || config.cor_botao || "#8B5CF6"}
              onChange={handleConfigChange}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cor do Texto do Botão PIX</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              name="cor_texto_botao_pix"
              value={config.cor_texto_botao_pix || config.cor_texto_botao || "#FFFFFF"}
              onChange={handleConfigChange}
              className="w-10 h-10 rounded overflow-hidden cursor-pointer"
            />
            <Input
              name="cor_texto_botao_pix"
              value={config.cor_texto_botao_pix || config.cor_texto_botao || "#FFFFFF"}
              onChange={handleConfigChange}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
