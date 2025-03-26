
import { Separator } from "@/components/ui/separator";
import { ConfigCheckout } from "@/lib/types/database-types";
import { ButtonSectionCard } from "./botoes/ButtonSectionCard";
import { MainButtonSettings } from "./botoes/MainButtonSettings";
import { CardButtonSettings } from "./botoes/CardButtonSettings";
import { PixButtonSettings } from "./botoes/PixButtonSettings";
import { SecurityMessageSettings } from "./botoes/SecurityMessageSettings";
import { VisitorCounterSettings } from "./botoes/VisitorCounterSettings";

interface BotoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BotoesTab({ config, handleConfigChange, handleSwitchChange }: BotoesTabProps) {
  return (
    <div className="space-y-6">
      <ButtonSectionCard 
        title="Configurações de Botões" 
        description="Configure os botões de ação e elementos interativos do checkout"
      >
        <div className="space-y-6">
          <h3 className="font-medium">Botão de Compra Principal</h3>
          <MainButtonSettings 
            config={config}
            handleConfigChange={handleConfigChange}
          />
          
          <h3 className="font-medium">Botão de Cartão</h3>
          <CardButtonSettings 
            config={config}
            handleConfigChange={handleConfigChange}
          />
          
          <h3 className="font-medium">Botão PIX</h3>
          <PixButtonSettings
            config={config}
            handleConfigChange={handleConfigChange}
          />
          
          <Separator />
          
          <SecurityMessageSettings
            config={config}
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
          
          <Separator />
          
          <VisitorCounterSettings 
            config={config}
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </div>
      </ButtonSectionCard>
    </div>
  );
}
