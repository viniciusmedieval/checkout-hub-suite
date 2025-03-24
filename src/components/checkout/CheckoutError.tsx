
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, Database, Settings } from "lucide-react";

interface CheckoutErrorProps {
  error: string | null;
}

export function CheckoutError({ error }: CheckoutErrorProps) {
  const handleReload = () => {
    window.location.reload();
  };

  const isSupabaseError = error?.includes("Supabase") || 
                           error?.includes("banco de dados") || 
                           error?.includes("conexão");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="space-y-4 max-w-md text-center">
        <div className="rounded-full bg-red-50 p-3 w-12 h-12 flex items-center justify-center mx-auto">
          <Database className="h-6 w-6 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800">
          {isSupabaseError ? "Erro de conexão com o banco de dados" : "Produto não encontrado"}
        </h1>
        
        <p className="text-gray-600">
          {error || "O produto que você está procurando não existe ou não está mais disponível."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
          <Button asChild variant="outline">
            <Link to="/produtos" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Produtos
            </Link>
          </Button>
          <Button onClick={handleReload} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
        
        {isSupabaseError && (
          <div className="mt-6">
            <Button asChild variant="ghost" className="text-primary">
              <Link to="/produtos" className="inline-flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configurar conexão do Supabase
              </Link>
            </Button>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500">
          <p className="mb-1 font-medium">Dicas de solução:</p>
          <ul className="list-disc pl-4 space-y-1 text-left">
            {isSupabaseError ? (
              <>
                <li>Verifique se as credenciais do Supabase estão configuradas corretamente</li>
                <li>Configure as credenciais na página de "Produtos" clicando no botão "Configurar conexão"</li>
                <li>Verifique sua conexão com a internet</li>
                <li>Tente usar as credenciais padrão na configuração do Supabase</li>
              </>
            ) : (
              <>
                <li>Verifique se o produto está marcado como "Ativo" no sistema</li>
                <li>Verifique se o slug no URL está correto</li>
                <li>Verifique se a API Supabase está online e funcionando</li>
                <li>Limpe o cache do navegador e tente novamente</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
