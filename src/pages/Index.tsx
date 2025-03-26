
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AutoTestRunner } from "@/components/configuracao/AutoTestRunner";
import { useState } from "react";
import { toast } from "sonner";
import { Beaker, ArrowRight } from "lucide-react";

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
    console.log("🔄 Iniciando teste automático a partir da página inicial");
    toast.info("Iniciando teste automático de configuração...");
    setIsRunningTest(true);
    navigate("/configuracao?autotest=true");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração</h1>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-amber-800 mb-3">Teste Automático de Configuração</h2>
        <p className="text-amber-700 mb-4">
          Clique no botão abaixo para executar automaticamente o teste de salvamento na página de configuração com os seguintes valores:
        </p>
        <ul className="list-disc list-inside mb-4 text-amber-700">
          <li><code className="bg-amber-100 px-1 rounded">cor_fundo: #FF0000</code> (Vermelho)</li>
          <li><code className="bg-amber-100 px-1 rounded">cor_texto: #FFFFFF</code> (Branco)</li>
          <li><code className="bg-amber-100 px-1 rounded">texto_botao: Finalizar Compra</code></li>
        </ul>
        <Button 
          onClick={handleRunConfigTest}
          disabled={isRunningTest}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-2 px-4 flex items-center gap-2"
          size="lg"
        >
          {isRunningTest ? (
            <>
              <span className="animate-spin mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </span>
              Executando Teste Automático...
            </>
          ) : (
            <>
              <Beaker className="w-5 h-5" />
              Executar Teste Automático
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>
      </div>
      
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
    </div>
  );
}
