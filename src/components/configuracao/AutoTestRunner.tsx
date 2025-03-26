
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AutoTestRunnerProps {
  onComplete?: () => void;
}

export const AutoTestRunner = ({ onComplete }: AutoTestRunnerProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const runTest = async () => {
      try {
        console.log("🔄 AutoTestRunner - Navegando para a página de configuração para teste automático");
        toast.info("Iniciando teste automático de configuração...");
        
        // Redirect to configuration page with autotest parameter
        navigate("/configuracao?autotest=true");
        
        if (onComplete) {
          onComplete();
        }
      } catch (error) {
        console.error("❌ Erro ao executar teste automático:", error);
        toast.error("Erro ao executar teste automático: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      }
    };
    
    // Run the test immediately
    runTest();
  }, [navigate, onComplete]);
  
  return null; // This component doesn't render anything
};
