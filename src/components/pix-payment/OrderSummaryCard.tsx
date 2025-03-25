
import React from "react";
import { Button } from "@/components/ui/button";
import { Produto } from "@/lib/types/database-types";
import { formatCurrency } from "@/utils/formatters";

interface OrderSummaryCardProps {
  produto: Produto;
  onBackToCheckout: () => void;
}

export function OrderSummaryCard({ produto, onBackToCheckout }: OrderSummaryCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Sua Compra</h2>
      
      <div className="flex items-start gap-3">
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-gray-100">
          <img 
            src={produto.imagem_url || 'https://placehold.co/100x100/f1f5f9/64748b?text=Produto'} 
            alt={produto.nome} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/100x100/f1f5f9/64748b?text=Produto';
            }}
          />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-500">Produto Digital</p>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-base font-medium text-gray-800">{produto.nome}</p>
              {produto.descricao && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{produto.descricao}</p>
              )}
            </div>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(produto.valor)}</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
        <p className="text-sm text-gray-500">Total:</p>
        <p className="text-lg font-bold text-green-600">{formatCurrency(produto.valor)}</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onBackToCheckout}
        className="w-full"
      >
        Voltar para o checkout
      </Button>
    </div>
  );
}
