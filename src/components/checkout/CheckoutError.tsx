
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CheckoutErrorProps {
  error: string | null;
}

export function CheckoutError({ error }: CheckoutErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="space-y-4 max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
        <p className="text-gray-600">
          {error || "O produto que você está procurando não existe ou não está mais disponível."}
        </p>
        <Button asChild variant="outline">
          <Link to="/produtos" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Produtos
          </Link>
        </Button>
      </div>
    </div>
  );
}
