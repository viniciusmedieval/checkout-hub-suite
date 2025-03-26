
import { useConfiguracao } from "@/components/configuracao/useConfiguracao";
import { LoadingState } from "@/components/configuracao/LoadingState";
import { ConfigCheckout } from "@/lib/types/database-types";
import { useEffect } from "react";
import { ConfigHeader } from "@/components/configuracao/ConfigHeader";
import { ConfigTabs } from "@/components/configuracao/ConfigTabs";
import { useConfigActions } from "@/components/configuracao/hooks/useConfigActions";

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
  
  const {
    isSaveAttempted,
    saveSuccess,
    isTestSaving,
    isAutoTestRunning,
    onSaveClick,
    runTestSave,
    runAutomaticTest
  } = useConfigActions(
    config, 
    setConfig, 
    handleSaveConfig, 
    hasUnsavedChanges, 
    reloadConfig
  );

  useEffect(() => {
    console.log("Configuracao component - Current config:", config);
  }, [config]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldAutoTest = params.get("autotest") === "true";
    
    if (shouldAutoTest && !loading && !isAutoTestRunning) {
      console.log("🔄 Parâmetro de URL 'autotest=true' detectado, iniciando teste automático...");
      runAutomaticTest();
    }
  }, [loading, isAutoTestRunning, runAutomaticTest]);

  if (loading) {
    return <LoadingState />;
  }

  const typedConfig = config as unknown as ConfigCheckout;

  return (
    <div className="space-y-6 animate-fade-in bg-white p-6 rounded-lg">
      <ConfigHeader
        isAutoTestRunning={isAutoTestRunning}
        isSaving={isSaving}
        isSaveAttempted={isSaveAttempted}
        isTestSaving={isTestSaving}
        saveSuccess={saveSuccess}
        hasUnsavedChanges={hasUnsavedChanges}
        onSaveClick={onSaveClick}
        runTestSave={runTestSave}
        runAutomaticTest={runAutomaticTest}
      />

      <ConfigTabs
        typedConfig={typedConfig}
        depoimentos={depoimentos}
        depoimentosSaving={depoimentosSaving}
        handleConfigChange={handleConfigChange}
        handleSwitchChange={handleSwitchChange}
        handleIconChange={handleIconChange}
        handleStatusChange={handleStatusChange}
        handleSelectChange={handleSelectChange}
        handleDeleteTestimonial={handleDeleteTestimonial}
        handleAddTestimonial={handleAddTestimonial}
        handleUpdateTestimonial={handleUpdateTestimonial}
      />
    </div>
  );
};

export default Configuracao;
