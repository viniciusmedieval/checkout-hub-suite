
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfiguracao } from "@/components/configuracao/useConfiguracao";
import { LoadingState } from "@/components/configuracao/LoadingState";
import { HeaderTab } from "@/components/configuracao/sections/HeaderTab";
import { ConteudoTab } from "@/components/configuracao/sections/ConteudoTab";
import { FormularioTab } from "@/components/configuracao/sections/FormularioTab";
import { DepoimentosTab } from "@/components/configuracao/DepoimentosTab";
import { RodapeTab } from "@/components/configuracao/sections/RodapeTab";
import { BotoesTab } from "@/components/configuracao/sections/BotoesTab";
import { IconesTab } from "@/components/configuracao/sections/IconesTab";
import { VisualTab } from "@/components/configuracao/sections/VisualTab";
import { RedirecoesTab } from "@/components/configuracao/sections/RedirecoesTab";
import { RandomModeTab } from "@/components/configuracao/sections/RandomModeTab";
import { PixConfigTab } from "@/components/configuracao/sections/PixConfigTab";
import { InstallmentsTab } from "@/components/configuracao/sections/InstallmentsTab";
import { toast } from "sonner";
import { ConfigCheckout } from "@/lib/types/database-types";
import { useEffect, useState } from "react";
import { CheckCircle, Save, BeakerIcon } from "lucide-react";

const Configuracao = () => {
  const {
    config,
    loading,
    isSaving,
    depoimentos,
    depoimentosSaving,
    handleConfigChange,
    handleSwitchChange,
    handleIconChange,
    handleStatusChange,
    handleSelectChange,
    handleSaveConfig,
    hasUnsavedChanges,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial,
    reloadConfig,
    setConfig
  } = useConfiguracao();
  
  const [isSaveAttempted, setIsSaveAttempted] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTestSaving, setIsTestSaving] = useState(false);

  useEffect(() => {
    console.log("Configuracao component - Current config:", config);
  }, [config]);

  if (loading) {
    return <LoadingState />;
  }

  const typedConfig = config as unknown as ConfigCheckout;

  const onSaveClick = async () => {
    setIsSaveAttempted(true);
    setSaveSuccess(false);
    
    if (!hasUnsavedChanges()) {
      toast.info("Não há alterações para salvar");
      setIsSaveAttempted(false);
      return;
    }
    
    console.log("Saving configuration...", config);
    
    try {
      const savedConfig = await handleSaveConfig();
      
      if (savedConfig) {
        console.log("Configuration saved successfully:", savedConfig);
        await reloadConfig();
        setSaveSuccess(true);
        toast.success("Configurações salvas com sucesso!");
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("Failed to save configuration");
        toast.error("Falha ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Erro ao salvar configurações: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsSaveAttempted(false);
    }
  };

  // Add a test function to save specific values
  const runTestSave = async () => {
    setIsTestSaving(true);
    const testConfig = { ...typedConfig };
    
    // Define our test values
    testConfig.cor_fundo = "#FF0000";
    testConfig.cor_texto = "#FFFFFF";
    testConfig.texto_botao = "Finalizar Compra";
    
    console.log("🧪 Executando teste de salvamento com valores específicos:", testConfig);
    
    // Update the current config with test values
    setConfig(testConfig);
    
    // Trigger the save function
    try {
      const savedConfig = await handleSaveConfig();
      
      if (savedConfig) {
        console.log("🧪 Teste de configuração salvo com sucesso:", savedConfig);
        await reloadConfig();
        setSaveSuccess(true);
        toast.success("Teste: Configurações salvas com sucesso!");
        
        // Reset success state after 3 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        console.error("🧪 Falha no teste de salvamento de configuração");
        toast.error("Teste: Falha ao salvar configurações. Tente novamente.");
      }
    } catch (error) {
      console.error("🧪 Erro no teste de salvamento:", error);
      toast.error("Teste: Erro ao salvar configurações: " + (error instanceof Error ? error.message : "Erro desconhecido"));
    } finally {
      setIsTestSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuração do Checkout</h1>
        <div className="flex gap-2">
          <Button 
            onClick={runTestSave}
            disabled={isTestSaving}
            className="bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
          >
            {isTestSaving ? (
              <>
                <span className="animate-spin mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </span>
                Testando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9.4 16.6L4.8 12l4.6-4.6M14.6 16.6l4.6-4.6-4.6-4.6"/></svg>
                Testar Salvamento
              </>
            )}
          </Button>
          <Button 
            onClick={onSaveClick} 
            disabled={isSaving || !hasUnsavedChanges() || isSaveAttempted}
            className={`${saveSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-300`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </span>
                Salvando...
              </>
            ) : isSaveAttempted ? (
              <>Processando...</>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvo com Sucesso
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-11 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="visual" className="data-[state=active]:bg-white">Visual</TabsTrigger>
          <TabsTrigger value="header" className="data-[state=active]:bg-white">Topo</TabsTrigger>
          <TabsTrigger value="formulario" className="data-[state=active]:bg-white">Formulário</TabsTrigger>
          <TabsTrigger value="pix" className="data-[state=active]:bg-white">PIX</TabsTrigger>
          <TabsTrigger value="parcelas" className="data-[state=active]:bg-white">Parcelas</TabsTrigger>
          <TabsTrigger value="depoimentos" className="data-[state=active]:bg-white">Depoimentos</TabsTrigger>
          <TabsTrigger value="botoes" className="data-[state=active]:bg-white">Botões</TabsTrigger>
          <TabsTrigger value="icones" className="data-[state=active]:bg-white">Ícones</TabsTrigger>
          <TabsTrigger value="rodape" className="data-[state=active]:bg-white">Rodapé</TabsTrigger>
          <TabsTrigger value="redirects" className="data-[state=active]:bg-white">Redirecionamentos</TabsTrigger>
          <TabsTrigger value="random" className="data-[state=active]:bg-white">Modo Teste</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4 mt-4">
          <VisualTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="header" className="space-y-4 mt-4">
          <HeaderTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="formulario" className="space-y-4 mt-4">
          <FormularioTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
        
        <TabsContent value="pix" className="space-y-4 mt-4">
          <PixConfigTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleSelectChange={handleSelectChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
        
        <TabsContent value="parcelas" className="space-y-4 mt-4">
          <InstallmentsTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
          />
        </TabsContent>

        <TabsContent value="icones" className="space-y-4 mt-4">
          <IconesTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleIconChange={handleIconChange}
          />
        </TabsContent>

        <TabsContent value="depoimentos" className="space-y-4 mt-4">
          <DepoimentosTab 
            depoimentos={depoimentos}
            depoimentosSaving={depoimentosSaving}
            handleDeleteTestimonial={handleDeleteTestimonial}
            handleAddTestimonial={handleAddTestimonial}
            handleUpdateTestimonial={handleUpdateTestimonial}
          />
        </TabsContent>

        <TabsContent value="botoes" className="space-y-4 mt-4">
          <BotoesTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="rodape" className="space-y-4 mt-4">
          <RodapeTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="redirects" className="space-y-4 mt-4">
          <RedirecoesTab 
            config={typedConfig} 
            handleConfigChange={handleConfigChange}
            handleStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="random" className="space-y-4 mt-4">
          <RandomModeTab 
            config={typedConfig} 
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracao;
