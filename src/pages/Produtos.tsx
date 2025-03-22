
import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Mock data
const mockProdutos = [
  { 
    id: 1, 
    nome: "Curso de Marketing Digital", 
    tipo: "digital", 
    valor: 297.00, 
    descricao: "Aprenda marketing digital do zero ao avançado", 
    ativo: true,
    slug: "curso-marketing-digital",
    imagem_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Curso+Marketing",
    checkout_title: "Curso de Marketing Digital 2.0",
    criado_em: "2023-03-15T10:30:00Z"
  },
  { 
    id: 2, 
    nome: "E-book Finanças Pessoais", 
    tipo: "ebook", 
    valor: 47.00, 
    descricao: "Guia completo para organizar suas finanças", 
    ativo: true,
    slug: "ebook-financas-pessoais",
    imagem_url: "https://placehold.co/600x400/10b981/FFFFFF/png?text=Ebook+Finanças",
    checkout_title: "E-book: Finanças Pessoais",
    criado_em: "2023-04-22T14:15:00Z"
  },
  { 
    id: 3, 
    nome: "Mentorias de Vendas", 
    tipo: "assinatura", 
    valor: 997.00, 
    descricao: "Mentorias mensais para aumentar suas vendas", 
    ativo: false,
    slug: "mentorias-vendas",
    imagem_url: "https://placehold.co/600x400/f97316/FFFFFF/png?text=Mentorias+Vendas",
    checkout_title: "Programa de Mentorias de Vendas",
    criado_em: "2023-01-10T09:45:00Z"
  },
];

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState(mockProdutos);

  const filteredProdutos = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: number) => {
    setProdutos(produtos.map(produto => 
      produto.id === id ? { ...produto, ativo: !produto.ativo } : produto
    ));
    
    const produto = produtos.find(p => p.id === id);
    toast.success(`Status do produto "${produto?.nome}" foi alterado`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProdutos.map((produto) => (
          <Card key={produto.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <img
                  src={produto.imagem_url}
                  alt={produto.nome}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={produto.ativo ? "default" : "secondary"} className="text-xs">
                    {produto.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardTitle className="text-xl mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {produto.nome}
              </CardTitle>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium capitalize">{produto.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-medium">R$ {produto.valor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Slug:</span>
                  <span className="font-medium text-xs">{produto.slug}</span>
                </div>
                <p className="text-muted-foreground mt-2 line-clamp-2">{produto.descricao}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-0">
              <Button variant="outline" className="flex-1">Editar</Button>
              <Button 
                variant={produto.ativo ? "destructive" : "default"} 
                className="flex-1"
                onClick={() => handleToggleStatus(produto.id)}
              >
                {produto.ativo ? "Desativar" : "Ativar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Produtos;
