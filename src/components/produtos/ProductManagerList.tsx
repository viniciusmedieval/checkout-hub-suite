
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Copy, Pencil, ExternalLink } from "lucide-react";
import { PaymentStatusControl } from "./PaymentStatusControl";
import { formatCurrency } from "@/utils/formatters";

export function ProductList({ 
  products, 
  search, 
  filter, 
  onEdit, 
  onCopyLink 
}) {
  // Filtragem de produtos baseada na pesquisa e filtro
  const filteredProducts = products.filter(product => {
    // Filtragem por nome (search)
    if (search && !product.nome.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    // Filtragem por tipo (filter)
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

      <div className="p-4 border-t">
        <h3 className="font-medium mb-2">Controle de Status de Pagamento</h3>
        <p className="text-sm text-gray-500 mb-4">
          Selecione um produto abaixo para simular diferentes status de pagamento.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={`status-${product.id}`} className="border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-3 truncate">{product.nome}</h4>
              <PaymentStatusControl productSlug={product.slug} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
