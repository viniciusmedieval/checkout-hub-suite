
import { toast } from "sonner";
import { ConfigCheckout } from "@/lib/types/database-types";
import { saveConfig } from "../services";
import { PaymentStatus } from "@/components/checkout/payment/types";

export const useConfigSaver = (
  config: ConfigCheckout | null,
  setConfig: (config: ConfigCheckout) => void,
  reloadConfig: () => Promise<void>
) => {
  // Function to save the configuration and reload
  const saveAndReloadConfig = async () => {
    try {
      console.log("🔄 Iniciando saveAndReloadConfig com:", config);
      
      if (!config) {
        console.error("❌ Configuração vazia ou nula");
        toast.error("Erro: Configuração vazia ou nula");
        return false;
      }
      
      // Ensure required fields with proper types
      const configToSave = {
        ...config,
        redirect_card_status: config.redirect_card_status || "analyzing",
        // Ensure PIX fields
        pix_titulo: config.pix_titulo || "Pagamento via Pix",
        pix_subtitulo: config.pix_subtitulo || "Copie o código ou use a câmera para ler o QR Code e realize o pagamento no app do seu banco.",
        pix_instrucoes: config.pix_instrucoes || "Para realizar o pagamento:",
        pix_mensagem_seguranca: config.pix_mensagem_seguranca || "Os bancos reforçaram a segurança do Pix e podem exibir avisos preventivos. Não se preocupe, sua transação está protegida.",
        // Ensure Installments field
        max_installments: config.max_installments || 12
      } as ConfigCheckout;
      
      // Save the configuration
      const savedConfig = await saveConfig(configToSave);
      
      if (savedConfig) {
        console.log("✅ Configurações salvas com sucesso:", savedConfig);
        toast.success("Configurações aplicadas com sucesso!");
        
        // Cast to ensure proper typing
        const typedSavedConfig = {
          ...savedConfig,
          redirect_card_status: (savedConfig.redirect_card_status || "analyzing") as PaymentStatus
        } as ConfigCheckout;
        
        // Update the state with saved data
        setConfig(typedSavedConfig);
        
        // Force reload from database to ensure consistency
        setTimeout(() => {
          reloadConfig();
        }, 500);
        
        return true;
      } else {
        console.error("❌ Falha ao salvar configurações: retorno nulo");
        toast.error("Configurações não foram salvas. Verifique os erros.");
        return false;
      }
    } catch (error) {
      console.error("❌ Erro ao salvar e recarregar:", error);
      toast.error("Erro ao salvar as configurações");
      return false;
    }
  };

  return {
    saveAndReloadConfig
  };
};
