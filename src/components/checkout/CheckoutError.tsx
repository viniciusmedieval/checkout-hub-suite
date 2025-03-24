
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface CheckoutErrorProps {
  error: string | null;
}

export function CheckoutError({ error }: CheckoutErrorProps) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="space-y-4 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
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
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500">
          <p className="mb-1 font-medium">Dicas de solução:</p>
          <ul className="list-disc pl-4 space-y-1 text-left">
            <li>Verifique se o Supabase está configurado corretamente em "Produtos"</li>
            <li>Verifique se o produto está marcado como "Ativo" no sistema</li>
            <li>Verifique se o slug no URL está correto</li>
            <li>Limpe o cache do navegador e tente novamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
