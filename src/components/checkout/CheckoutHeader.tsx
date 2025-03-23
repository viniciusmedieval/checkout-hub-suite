
import { Produto } from "@/lib/supabase";

interface CheckoutHeaderProps {
  produto: Produto;
  configCheckout?: {
    mensagem_topo?: string;
    texto_botao?: string;
  };
}

export function CheckoutHeader({ produto, configCheckout }: CheckoutHeaderProps) {
  const scrollToForm = () => {
    const formElement = document.getElementById('checkout-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Top message bar */}
      <div className="bg-blue-600 text-center py-2 text-xs text-white font-medium">
        <p>{configCheckout?.mensagem_topo || "Tempo limitado! Preços promocionais encerram em breve."}</p>
      </div>

      {/* Product header/banner */}
      <div className="w-full py-6 px-4 text-center">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{produto.nome}</h1>
            <p className="text-sm text-gray-600 mb-4">{produto.descricao}</p>
            
            {produto.banner_url && (
              <div className="mt-4 w-full max-w-3xl mx-auto">
                <img 
                  src={produto.banner_url} 
                  alt={produto.nome} 
                  className="w-full h-auto rounded-md shadow-md" 
                />
              </div>
            )}

            <div className="mt-6">
              <button 
                onClick={scrollToForm}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm transition-colors"
              >
                {configCheckout?.texto_botao || "PREENCHA SEUS DADOS ABAIXO"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
