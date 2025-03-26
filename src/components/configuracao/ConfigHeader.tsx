
import { Button } from "@/components/ui/button";
import { CheckCircle, Save, BeakerIcon, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ConfigCheckout } from "@/lib/types/database-types";
import { runAutoSaveTest } from "@/components/configuracao/utils/autoTestSave";

interface ConfigHeaderProps {
  isAutoTestRunning: boolean;
  isSaving: boolean;
  isSaveAttempted: boolean;
  isTestSaving: boolean;
  saveSuccess: boolean;
  hasUnsavedChanges: () => boolean;
  onSaveClick: () => Promise<void>;
  runTestSave: () => Promise<void>;
  runAutomaticTest: () => Promise<void>;
}

export function ConfigHeader({
  isAutoTestRunning,
  isSaving,
  isSaveAttempted,
  isTestSaving,
  saveSuccess,
  hasUnsavedChanges,
  onSaveClick,
  runTestSave,
  runAutomaticTest
}: ConfigHeaderProps) {
  
  const handleSaveClick = async () => {
    console.log("🔘 Botão de salvar alterações clicado");
    try {
      await onSaveClick();
      console.log("✅ Função onSaveClick executada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao salvar alterações:", error);
      toast.error(`Erro ao salvar: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  };

  const handleTestSaveClick = async () => {
    console.log("🔘 Botão de testar salvamento clicado");
    try {
      await runTestSave();
      console.log("✅ Função runTestSave executada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao testar salvamento:", error);
      toast.error(`Erro no teste: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  };

  const handleAutoTestClick = async () => {
    console.log("🔘 Botão de teste automático clicado");
    try {
      await runAutomaticTest();
      console.log("✅ Função runAutomaticTest executada com sucesso");
    } catch (error) {
      console.error("❌ Erro ao executar teste automático:", error);
      toast.error(`Erro no teste automático: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuração do Checkout</h1>
      <div className="flex gap-2">
        <Button 
          onClick={handleAutoTestClick}
          disabled={isAutoTestRunning}
          className="bg-green-600 hover:bg-green-700 transition-colors duration-300"
        >
          {isAutoTestRunning ? (
            <>
              <span className="animate-spin mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </span>
              Executando Teste...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Teste Automático
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleTestSaveClick}
          disabled={isTestSaving || isAutoTestRunning}
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
              <BeakerIcon className="w-4 h-4 mr-2" />
              Testar Salvamento
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleSaveClick} 
          disabled={isSaving || !hasUnsavedChanges() || isAutoTestRunning}
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
  );
}
