import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, ExternalLink, CreditCard } from "lucide-react";
import { PaymentStatusControl } from "./PaymentStatusControl";
import { formatCurrency } from "@/utils/formatters";
import { PaymentStatus } from "@/hooks/checkout";

export function ProductList({ 
  products, 
  search, 
  filter, 
  onEdit, 
  onCopyLink 
}) {
  const [cardRedirectStates, setCardRedirectStates] = useState<Record<string, PaymentStatus>>({});
  
  useEffect(() => {
    const states: Record<string, PaymentStatus> = {};
    
    products.forEach(product => {
      const savedStatus = localStorage.getItem(`card_redirect_${product.slug}`);
      if (savedStatus && ['analyzing', 'approved', 'rejected'].includes(savedStatus)) {
        states[product.slug] = savedStatus as PaymentStatus;
      } else {
        states[product.slug] = 'approved';
      }
    });
    
    setCardRedirectStates(states);
  }, [products]);
  
  const getStatusLabel = (status: PaymentStatus): string => {
    switch(status) {
      case 'analyzing': return 'Em Análise';
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Recusado';
      default: return status;
    }
  };
  
  const getStatusColor = (status: PaymentStatus): string => {
    switch(status) {
      case 'analyzing': return 'text-amber-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const filteredProducts = products.filter(product => {
    if (search && !product.nome.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    if (filter !== "todos" && product.tipo !== filter) {
      return false;
    }
    
    return true;
  });

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md text-center">
        <h3 className="font-medium text-lg">Nenhum produto encontrado</h3>
        <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou criar um novo produto.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.nome}</TableCell>
              <TableCell>
                {product.tipo === "fisico" && "Físico"}
                {product.tipo === "digital" && "Digital"}
                {product.tipo === "assinatura" && "Assinatura"}
                {product.tipo === "servico" && "Serviço"}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.valor)}
              </TableCell>
              <TableCell>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${product.ativo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {product.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCopyLink(product)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href={`/checkout/${product.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="p-6 border-t bg-gray-50">
        <h3 className="text-lg font-medium mb-3">Controle de Status de Pagamento</h3>
        <p className="text-sm text-gray-500 mb-5">
          Configure para onde o cliente será redirecionado após o pagamento e simule diferentes status.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={`status-${product.id}`} className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-1 truncate">{product.nome}</h4>
              
              <div className="flex items-center mb-3 text-sm text-gray-500">
                <CreditCard className="w-4 h-4 mr-1" />
                <span>Pagamento com cartão vai para: </span>
                <span className={`ml-1 font-medium ${getStatusColor(cardRedirectStates[product.slug] || 'approved')}`}>
                  {getStatusLabel(cardRedirectStates[product.slug] || 'approved')}
                </span>
              </div>
              
              <PaymentStatusControl productSlug={product.slug} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
