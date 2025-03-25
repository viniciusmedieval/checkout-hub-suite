
import { ConfigCheckout } from "@/lib/types/database-types";
import { ButtonSectionCard } from "./botoes/ButtonSectionCard";
import { PixButtonSettings } from "./botoes/PixButtonSettings";
import { CardButtonSettings } from "./botoes/CardButtonSettings";
import { VisitorCounterSettings } from "./botoes/VisitorCounterSettings";
import { SecurityMessageSettings } from "./botoes/SecurityMessageSettings";

interface BotoesTabProps {
  config: ConfigCheckout;
  handleConfigChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export function BotoesTab({ config, handleConfigChange, handleSwitchChange }: BotoesTabProps) {
  return (
    <ButtonSectionCard 
      title="Botão de Compra e Contador" 
      description="Configure o botão de compra e contador de visitantes"
    >
      <PixButtonSettings 
        config={config} 
        handleConfigChange={handleConfigChange} 
      />
      
      <CardButtonSettings 
        config={config} 
        handleConfigChange={handleConfigChange} 
      />
      
      <VisitorCounterSettings 
        config={config} 
        handleConfigChange={handleConfigChange} 
        handleSwitchChange={handleSwitchChange} 
      />
      
      <SecurityMessageSettings 
        config={config} 
        handleConfigChange={handleConfigChange} 
        handleSwitchChange={handleSwitchChange} 
      />
    </ButtonSectionCard>
  );
}
