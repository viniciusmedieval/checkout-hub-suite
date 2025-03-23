
import { Copy, Package, Trash2 } from "lucide-react";
import { Produto } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ProductListProps {
  produtos: Produto[];
  loading: boolean;
  searchTerm: string;
  onEdit: (product: Produto) => void;
  onToggleStatus: (id: number) => void;
}

export function ProductList({ produtos, loading, searchTerm, onEdit, onToggleStatus }: ProductListProps) {
  const filteredProdutos = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (id: number, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Refrescar a página para mostrar os dados atualizados
      window.location.reload();
      toast.success(`Produto "${nome}" excluído com sucesso!`);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Falha ao excluir o produto');
    }
  };

  const handleCopyCheckoutLink = (slug: string) => {
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${slug}`;
    
    console.log("Copiando link de checkout:", checkoutUrl);
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        toast.success('Link de checkout copiado para a área de transferência!');
      })
      .catch((error) => {
        console.error('Erro ao copiar link:', error);
        toast.error('Não foi possível copiar o link');
      });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="pt-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 pt-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (produtos.length === 0 || filteredProdutos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
        <Package className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
        <p className="text-sm text-muted-foreground mt-2">
          {searchTerm ? 'Tente ajustar sua busca.' : 'Adicione produtos para começar.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredProdutos.map((produto) => (
        <Card key={produto.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <img
                src={produto.imagem_url || "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Produto"}
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
          <CardFooter className="flex flex-col gap-2 pt-0">
            <div className="flex justify-between gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onEdit(produto)}
              >
                Editar
              </Button>
              <Button 
                variant={produto.ativo ? "destructive" : "default"} 
                className="flex-1"
                onClick={() => onToggleStatus(produto.id)}
              >
                {produto.ativo ? "Desativar" : "Ativar"}
              </Button>
            </div>
            <div className="flex justify-between gap-2 w-full">
              <Button 
                variant="outline" 
                className="flex-1 gap-2"
                onClick={() => handleCopyCheckoutLink(produto.slug)}
              >
                <Copy className="h-4 w-4" />
                Copiar Link
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 gap-2"
                onClick={() => handleDeleteProduct(produto.id, produto.nome)}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
