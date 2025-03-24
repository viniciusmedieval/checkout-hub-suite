
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
import { toast } from "sonner";

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
    handleSaveConfig,
    hasUnsavedChanges,
    handleDeleteTestimonial,
    handleAddTestimonial,
    handleUpdateTestimonial
  } = useConfiguracao();

  if (loading) {
    return <LoadingState />;
  }

  const onSaveClick = async () => {
    if (!hasUnsavedChanges()) {
      toast.info("Não há alterações para salvar");
      return;
    }
    await handleSaveConfig();
  };

  return (
    <div className="space-y-6 animate-fade-in bg-white p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuração do Checkout</h1>
        <Button 
          onClick={onSaveClick} 
          disabled={isSaving || !hasUnsavedChanges()}
        >
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      <Tabs defaultValue="visual" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="visual" className="data-[state=active]:bg-white">Visual</TabsTrigger>
          <TabsTrigger value="header" className="data-[state=active]:bg-white">Topo</TabsTrigger>
          <TabsTrigger value="formulario" className="data-[state=active]:bg-white">Formulário</TabsTrigger>
          <TabsTrigger value="depoimentos" className="data-[state=active]:bg-white">Depoimentos</TabsTrigger>
          <TabsTrigger value="botoes" className="data-[state=active]:bg-white">Botões</TabsTrigger>
          <TabsTrigger value="icones" className="data-[state=active]:bg-white">Ícones</TabsTrigger>
          <TabsTrigger value="rodape" className="data-[state=active]:bg-white">Rodapé</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4 mt-4">
          <VisualTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="header" className="space-y-4 mt-4">
          <HeaderTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="formulario" className="space-y-4 mt-4">
          <FormularioTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="icones" className="space-y-4 mt-4">
          <IconesTab 
            config={config} 
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
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>

        <TabsContent value="rodape" className="space-y-4 mt-4">
          <RodapeTab 
            config={config} 
            handleConfigChange={handleConfigChange}
            handleSwitchChange={handleSwitchChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracao;
