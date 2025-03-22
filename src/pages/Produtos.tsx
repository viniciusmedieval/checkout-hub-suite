
import { useState, useEffect } from "react";
import { Package, Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase, Produto } from "@/lib/supabase";
import { ProductsManager } from "@/components/produtos/ProductsManager";
import { Skeleton } from "@/components/ui/skeleton";

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*');
      
      if (error) throw error;
      
      setProdutos(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Falha ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      // Find the current produto
      const currentProduto = produtos.find(p => p.id === id);
      if (!currentProduto) return;
      
      // Toggle the status in the database
      const { error } = await supabase
        .from('produtos')
        .update({ ativo: !currentProduto.ativo })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update the local state
      setProdutos(produtos.map(produto => 
        produto.id === id ? { ...produto, ativo: !produto.ativo } : produto
      ));
      
      toast.success(`Status do produto "${currentProduto.nome}" foi alterado`);
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Falha ao atualizar o status do produto');
    }
  };

  const filteredProdutos = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-4 mb-4">
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
            <Button variant="outline" onClick={fetchProdutos}>
              <Database className="h-4 w-4 mr-2" />
              Recarregar
            </Button>
          </div>
          
          {loading ? (
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
          ) : filteredProdutos.length > 0 ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Nenhum produto encontrado</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {searchTerm ? 'Tente ajustar sua busca.' : 'Adicione produtos para começar.'}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <ProductsManager />
        </div>
      </div>
    </div>
  );
};

export default Produtos;
