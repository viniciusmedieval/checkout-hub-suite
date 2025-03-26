
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase, getSupabaseClient } from "@/lib/supabase";

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
        
        // Check Supabase connection before redirecting
        try {
          // Get client from the singleton to ensure we're using the latest instance
          const client = await getSupabaseClient();
          if (!client) {
            throw new Error("Não foi possível inicializar o cliente Supabase");
          }
          
          // Test with a simple existence check that won't cause parsing issues
          const { data, error } = await client
            .from('config_checkout')
            .select('id')  // Only select ID to avoid parsing issues
            .limit(1);
            
          if (error) {
            console.error("❌ AutoTestRunner - Erro ao verificar conexão com Supabase:", error);
            throw new Error(`Erro de conexão com o banco de dados: ${error.message}`);
          }
          
          console.log("✅ AutoTestRunner - Conexão com Supabase verificada com sucesso");
          console.log("✅ AutoTestRunner - Dados retornados:", data);
        } catch (connError: any) {
          console.error("❌ AutoTestRunner - Falha na verificação da conexão:", connError);
          toast.error(`Falha na conexão com o banco de dados: ${connError.message}`);
          setTestStatus("failed");
          if (onComplete) onComplete();
          return;
        }
        
        // Redirect to configuration page with autotest parameter
        console.log("🔄 AutoTestRunner - Redirecionando para página de configuração com autotest=true");
        navigate("/configuracao?autotest=true");
        
        // Set a timeout to display success message in case we don't return to this component
        setTimeout(() => {
          console.log("✅ AutoTestRunner - Teste iniciado com sucesso na página de configuração");
          setTestStatus("completed");
          
          if (onComplete) {
            onComplete();
          }
        }, 1000);
      } catch (error: any) {
        setTestStatus("failed");
        console.error("❌ Erro ao executar teste automático:", error);
        toast.error(`Erro ao executar teste automático: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
        
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
