
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AutoTestRunner } from "@/components/configuracao/AutoTestRunner";
import { useState } from "react";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  
  // Check for URL param to start test automatically
  const params = new URLSearchParams(window.location.search);
  const autoRunTest = params.get("runConfigTest") === "true";
  
  if (autoRunTest && !isRunningTest && !testComplete) {
    setIsRunningTest(true);
    return <AutoTestRunner onComplete={() => setTestComplete(true)} />;
  }
  
  const handleRunConfigTest = () => {
    setIsRunningTest(true);
    navigate("/configuracao?autotest=true");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600 mb-4">Visualize estatísticas e métricas de vendas</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-blue-600 hover:bg-blue-700">
            Acessar Dashboard
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Produtos</h2>
          <p className="text-gray-600 mb-4">Gerencie seus produtos e ofertas</p>
          <Button onClick={() => navigate("/produtos")} className="bg-blue-600 hover:bg-blue-700">
            Gerenciar Produtos
          </Button>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Configurações</h2>
          <p className="text-gray-600 mb-4">Personalize seu checkout e páginas</p>
          <Button onClick={() => navigate("/configuracao")} className="bg-blue-600 hover:bg-blue-700">
            Editar Configurações
          </Button>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recursos de Teste</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md border border-green-200">
            <h3 className="text-lg font-semibold mb-2">Teste Automático de Configuração</h3>
            <p className="text-gray-600 mb-4">
              Executa automaticamente o teste de salvamento na página de configuração com valores predefinidos:
              <ul className="list-disc list-inside mt-2">
                <li><code>cor_fundo: #FF0000</code></li>
                <li><code>cor_texto: #FFFFFF</code></li>
                <li><code>texto_botao: Finalizar Compra</code></li>
              </ul>
            </p>
            <Button 
              onClick={handleRunConfigTest}
              disabled={isRunningTest}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunningTest ? "Executando teste..." : "Executar Teste Automático"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
