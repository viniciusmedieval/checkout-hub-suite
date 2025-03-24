
import { useState } from "react";
import { Produto, ConfigCheckout } from "@/lib/supabase";
import { toast } from "sonner";
import { LockIcon, Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/utils/formatters";

interface ResumoCompraProps {
  produto: Produto;
  configCheckout?: ConfigCheckout | null;
  visitorCount?: number;
  isProcessing?: boolean;
  onCompletePurchase?: () => void;
}

export function ResumoCompra({ 
  produto, 
  configCheckout,
  visitorCount,
  isProcessing = false,
  onCompletePurchase
}: ResumoCompraProps) {
  
  // Obter a cor do botão e do texto do botão das configurações ou usar o padrão
  const buttonColor = configCheckout?.cor_botao || "#00C853"; // Verde por padrão 
  const buttonTextColor = configCheckout?.cor_texto_botao || "#FFFFFF";
  
  // Para debugging
  console.log("ResumoCompra - Configurações do checkout:", configCheckout);
  console.log("ResumoCompra - Contador de visitantes:", visitorCount);
  console.log("ResumoCompra - Mostrar contador:", configCheckout?.mostrar_contador);
  console.log("ResumoCompra - Mensagem rodapé:", configCheckout?.mensagem_rodape);
  console.log("ResumoCompra - Mensagem termos:", configCheckout?.mensagem_termos);
  
  const handleCompletePurchase = async () => {
    if (onCompletePurchase) {
      onCompletePurchase();
      return;
    }
    
    // Default behavior if no onCompletePurchase is provided
    try {
      // Dados do formulário (em uma aplicação real, estes seriam coletados do formulário)
      const clienteData = {
        nome: "Cliente Teste", // Em uma implementação real, viria do formulário
        email: "teste@exemplo.com", // Em uma implementação real, viria do formulário
        celular: "(00) 00000-0000", // Em uma implementação real, viria do formulário
        documento: "000.000.000-00", // Em uma implementação real, viria do formulário
        produto_id: produto.id,
        criado_em: new Date().toISOString()
      };

      // Inserir na tabela clientes
      const { data, error } = await supabase
        .from('clientes')
        .insert([clienteData]);

      if (error) {
        throw error;
      }

      // Exibir mensagem de sucesso
      toast.success("Pedido finalizado com sucesso!");
      
      // Redirecionar ou mostrar página de agradecimento
      // window.location.href = "/obrigado";
      
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Ocorreu um erro ao processar seu pedido. Tente novamente.");
    }
  };
  
  return (
    <div className="space-y-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between border-b pb-2 mb-2">
        <span className="text-sm font-medium text-black">Sua Compra</span>
        <span className="text-sm text-black">1 item</span>
      </div>
      
      <div className="flex items-center gap-3">
        {produto.imagem_url && (
          <img 
            src={produto.imagem_url} 
            alt={produto.nome} 
            className="w-12 h-12 object-cover rounded border border-gray-200"
          />
        )}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-black">{produto.nome}</h3>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">assinatura</p>
            <span className="text-sm font-bold text-black">{formatCurrency(Number(produto.valor))}</span>
          </div>
        </div>
      </div>
      
      {/* Show visitor count if provided and enabled in config - Corrigindo a lógica do contador */}
      {visitorCount !== undefined && configCheckout?.mostrar_contador === true && (
        <div className="text-xs text-gray-500 text-center mt-2 mb-2">
          <p>{configCheckout?.texto_contador?.replace('{count}', visitorCount.toString()) || 
              `${visitorCount} pessoas estão vendo este produto agora`}</p>
        </div>
      )}
      
      <button 
        className="w-full py-3 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2"
        onClick={handleCompletePurchase}
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
            <LockIcon size={14} />
            {configCheckout?.texto_botao || "ASSINAR AGORA"}
          </>
        )}
      </button>
      
      {/* Display security message from admin config - Garantindo que a mensagem apareça */}
      {configCheckout?.mensagem_rodape && configCheckout.mensagem_rodape.trim() !== "" && (
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500 gap-1.5">
          <Shield size={14} />
          <span>{configCheckout.mensagem_rodape}</span>
        </div>
      )}
      
      {/* Display terms message from admin config - Garantindo que a mensagem apareça */}
      {configCheckout?.mensagem_termos && configCheckout.mensagem_termos.trim() !== "" && (
        <div className="mt-2 text-xs text-gray-400 text-center">
          <p>{configCheckout.mensagem_termos}</p>
        </div>
      )}
    </div>
  );
}
