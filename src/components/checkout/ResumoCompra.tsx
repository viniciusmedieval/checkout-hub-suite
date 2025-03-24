
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { LockIcon, ShieldCheckIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface ResumoCompraProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  visitorCount: number;
  isProcessing: boolean;
  onCompletePurchase: () => void;
}

export function ResumoCompra({ 
  produto, 
  configCheckout,
  visitorCount,
  isProcessing, 
  onCompletePurchase 
}: ResumoCompraProps) {
  // Obter a cor do botão e do texto do botão das configurações ou usar o padrão
  const buttonColor = configCheckout?.cor_botao || "#00C853"; // Verde por padrão 
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3 mb-1">
          <span className="text-sm font-medium text-black">Sua Compra</span>
          <span className="text-sm text-black">1 item • {formatCurrency(Number(produto.valor))}</span>
        </div>
        
        <div className="flex items-center gap-3">
          {produto.imagem_url && (
            <img 
              src={produto.imagem_url} 
              alt={produto.nome} 
              className="w-10 h-10 object-cover rounded border border-gray-200"
            />
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-black">{produto.nome}</h3>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-600">assinatura</p>
              <span className="text-base font-bold text-black">{formatCurrency(Number(produto.valor))}/mês</span>
            </div>
          </div>
        </div>
        
        <button 
          className="w-full py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
          onClick={onCompletePurchase}
          disabled={isProcessing}
          style={{ 
            backgroundColor: buttonColor,
            color: buttonTextColor 
          }}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processando...
            </>
          ) : (
            <>
              <LockIcon size={16} />
              {configCheckout?.texto_botao || "ASSINE AGORA"}
            </>
          )}
        </button>
        
        {/* Mensagem de destaque do checkout - vindo do painel admin */}
        {configCheckout?.mensagem_rodape && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 text-center mt-3">
            <ShieldCheckIcon size={16} className="text-green-500" />
            <span dangerouslySetInnerHTML={{ __html: configCheckout.mensagem_rodape }} />
          </div>
        )}
        
        {/* Mensagem de termos de compra - vindo do painel admin */}
        {configCheckout?.mensagem_termos && (
          <div className="text-xs text-gray-500 text-center mt-3">
            <span 
              dangerouslySetInnerHTML={{ 
                __html: configCheckout.mensagem_termos
                  .replace('Termos de Compra', `<a href="${configCheckout.url_termos_uso || '#'}" class="text-blue-500 hover:underline">Termos de Compra</a>`)
                  .replace('Política de Privacidade', `<a href="${configCheckout.url_politica_privacidade || '#'}" class="text-blue-500 hover:underline">Política de Privacidade</a>`)
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
