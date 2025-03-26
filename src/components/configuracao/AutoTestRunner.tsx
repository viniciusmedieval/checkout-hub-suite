
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AutoTestRunnerProps {
  onComplete?: () => void;
}

export const AutoTestRunner = ({ onComplete }: AutoTestRunnerProps) => {
  const navigate = useNavigate();
  const [testStatus, setTestStatus] = useState<"initializing" | "running" | "completed" | "failed">("initializing");
  
  useEffect(() => {
    const runTest = async () => {
      try {
        setTestStatus("running");
        console.log("🔄 AutoTestRunner - Iniciando teste automático");
        console.log("🔄 AutoTestRunner - Valores do teste:");
        console.log("  - cor_fundo: #FF0000");
        console.log("  - cor_texto: #FFFFFF");
        console.log("  - texto_botao: Finalizar Compra");
        
        toast.info("Iniciando teste automático de configuração...", {
          description: "Testando salvamento com valores predefinidos"
        });
        
        // Redirect to configuration page with autotest parameter
        navigate("/configuracao?autotest=true");
        
        // Set a timeout to display success message in case we don't return to this component
        setTimeout(() => {
          console.log("✅ AutoTestRunner - Teste iniciado com sucesso na página de configuração");
          setTestStatus("completed");
          
          if (onComplete) {
            onComplete();
          }
        }, 1000);
      } catch (error) {
        setTestStatus("failed");
        console.error("❌ Erro ao executar teste automático:", error);
        toast.error("Erro ao executar teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
        
        if (onComplete) {
          onComplete();
        }
      }
    };
    
    // Run the test immediately
    runTest();
  }, [navigate, onComplete]);
  
  return null; // This component doesn't render anything
};
