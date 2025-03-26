
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
        
        // Simplificar verificação da conexão Supabase para evitar erros de parsing
        try {
          console.log("🔄 AutoTestRunner - Verificando conexão com Supabase...");
          
          const client = await getSupabaseClient();
          if (!client) {
            throw new Error("Não foi possível inicializar o cliente Supabase");
          }
          
          // Consulta simples para verificar a conexão
          const { data: connectionCheckData, error: connectionCheckError } = await client
            .from('config_checkout')
            .select('id')
            .limit(1);
            
          if (connectionCheckError) {
            console.error("❌ AutoTestRunner - Erro ao verificar conexão:", connectionCheckError);
            throw new Error(`Erro de conexão: ${connectionCheckError.message}`);
          }
          
          console.log("✅ AutoTestRunner - Conexão com Supabase verificada com sucesso:", connectionCheckData);
          
          // Redirecionar para página de configuração com parâmetro de teste
          console.log("🔄 AutoTestRunner - Redirecionando para página de configuração com autotest=true");
          navigate("/configuracao?autotest=true");
          
          // Definir um timeout para garantir que o status seja alterado
          setTimeout(() => {
            console.log("✅ AutoTestRunner - Teste iniciado com sucesso na página de configuração");
            setTestStatus("completed");
            
            if (onComplete) {
              onComplete();
            }
          }, 1000);
        } catch (connError: any) {
          console.error("❌ AutoTestRunner - Falha na verificação da conexão:", connError);
          toast.error(`Falha na conexão com o banco de dados: ${connError.message}`);
          setTestStatus("failed");
          if (onComplete) onComplete();
        }
      } catch (error: any) {
        setTestStatus("failed");
        console.error("❌ Erro ao executar teste automático:", error);
        toast.error(`Erro ao executar teste automático: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
        
        if (onComplete) {
          onComplete();
        }
      }
    };
    
    // Executar o teste imediatamente
    runTest();
  }, [navigate, onComplete]);
  
  return null; // Este componente não renderiza nada
};
