
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Produto, supabase } from "@/lib/supabase";
import { Loader2, Package, ArrowLeft, User, CreditCard, ShoppingBag, CheckCircle, ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock data for testimonials
const depoimentos = [
  {
    id: 1,
    nome: "Reinaldo martins da silva",
    foto: "https://placehold.co/200x200/3b82f6/FFFFFF/png?text=R",
    estrelas: 5,
    texto: "Cliente muito satisfeito com o serviço, realmente entregam o que prometem.",
    data: "Fev 03/22"
  },
  {
    id: 2,
    nome: "Juliana nascimento",
    foto: "https://placehold.co/200x200/ec4899/FFFFFF/png?text=J",
    estrelas: 5,
    texto: "Melhor investimento que fiz, tenho tudo na minha tv e celular por um valor simbólico, obrigada por existir OneClick <3",
    data: "Fev 08/22"
  },
  {
    id: 3,
    nome: "Rafaela pires",
    foto: "https://placehold.co/200x200/10b981/FFFFFF/png?text=R",
    estrelas: 5,
    texto: "Estou amando esse aplicativo, muito bom!",
    data: "Fev 10/22"
  }
];

const Checkout = () => {
  const { slug } = useParams<{ slug: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cartao' | 'pix'>('cartao');
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchProduto = async () => {
      if (!slug) {
        setError("Produto não encontrado");
        setLoading(false);
        return;
      }

      try {
        console.log("Buscando produto com slug:", slug);
        
        // Recupera dados do localStorage como fallback
        const mockStorage = localStorage.getItem('mockSupabaseStorage');
        if (mockStorage) {
          const parsedStorage = JSON.parse(mockStorage);
          if (parsedStorage && parsedStorage.produtos) {
            console.log("Dados mockStorage encontrados:", parsedStorage.produtos);
            const produtoEncontrado = parsedStorage.produtos.find(
              (p: Produto) => p.slug === slug && p.ativo
            );
            
            if (produtoEncontrado) {
              console.log("Produto encontrado nos dados mockStorage:", produtoEncontrado);
              setProduto(produtoEncontrado);
              setLoading(false);
              return;
            }
          }
        }

        // Tenta buscar no Supabase se não encontrou no mockStorage
        const { data, error } = await supabase
          .from("produtos")
          .select("*")
          .eq("slug", slug)
          .eq("ativo", true)
          .single();

        console.log("Resposta do Supabase:", { data, error });
        
        if (error) throw error;
        
        if (!data) {
          setError("Produto não encontrado");
        } else {
          setProduto(data);
        }
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
        setError("Erro ao carregar o produto. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [slug]);

  const handleComprar = () => {
    toast.success("Compra realizada com sucesso!");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Carregando produto...</p>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
        <div className="space-y-4 max-w-md text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Produto não encontrado</h1>
          <p className="text-muted-foreground">
            {error || "O produto que você está procurando não existe ou não está mais disponível."}
          </p>
          <Button asChild>
            <Link to="/produtos" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Produtos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Banner superior */}
      <div 
        className="w-full bg-cover bg-center border-b" 
        style={{ 
          backgroundColor: produto.banner_color || '#801f1f',
          backgroundImage: produto.banner_url ? `url(${produto.banner_url})` : undefined
        }}
      >
        <div className="container mx-auto py-4">
          <img 
            src="public/lovable-uploads/a68eb03c-f41a-44fb-a13d-32dcf2d7b82b.png" 
            alt="Banner do checkout" 
            className="w-full h-auto"
          />
        </div>
      </div>
      
      <div className="container mx-auto py-6 px-4 flex-1">
        <div className="max-w-3xl mx-auto">
          {/* Seção de Dados do Usuário */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 text-left">Seus Dados</h2>
            <Card className="border rounded-lg overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium">Identificação</h3>
                      <p className="text-xs text-gray-500">
                        Tiger Golf Araújo {isMobile && <br />} <span className="text-blue-500">tigermarketingdigital@hotmail.com</span>, {isMobile && <br />} 77-9178-634-21, +55 71 99542-9738
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">&gt;</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Depoimentos */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-left">Depoimentos</h2>
              <span className="text-sm text-gray-500">{depoimentos.length} comentários</span>
            </div>
            <Card className="border rounded-lg overflow-hidden">
              <CardContent className="p-0">
                {depoimentos.map((depoimento, index) => (
                  <div key={depoimento.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <img 
                          src={depoimento.foto} 
                          alt={depoimento.nome} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-medium">{depoimento.nome}</h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400 text-xs">★</span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{depoimento.data}</span>
                        </div>
                        <p className="text-sm mt-2 text-left">{depoimento.texto}</p>
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <button className="flex items-center text-gray-500 text-xs">
                            <MessageCircle className="h-3 w-3 mr-1" />
                          </button>
                          <button className="flex items-center text-gray-500 text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Seção de Pagamento */}
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <h2 className="text-lg font-medium text-left">Pagamento</h2>
              <div className="ml-auto">
                <div className="flex text-sm space-x-4">
                  <button 
                    onClick={() => setActiveTab('cartao')} 
                    className={`pb-1 ${activeTab === 'cartao' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  >
                    Cartão de crédito
                  </button>
                </div>
              </div>
            </div>
            <Card className="border rounded-lg overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-6 bg-white border rounded flex items-center justify-center mr-2">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-green-500 text-sm">PCI</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="block text-sm text-gray-600 mb-1">Nome do titular</label>
                    <Input 
                      id="cardName"
                      placeholder="Digite o nome do titular"
                      className="w-full border-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm text-gray-600 mb-1">Número do cartão</label>
                    <Input 
                      id="cardNumber"
                      placeholder="Digite o número do seu cartão"
                      className="w-full border-gray-300"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-sm text-gray-600 mb-1">Vencimento</label>
                      <Input 
                        id="expiry"
                        placeholder="MM/AA"
                        className="w-full border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm text-gray-600 mb-1">CVV</label>
                      <Input 
                        id="cvv"
                        placeholder="000"
                        className="w-full border-gray-300"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="installments" className="block text-sm text-gray-600 mb-1">Parcelamento</label>
                    <div className="relative">
                      <select 
                        id="installments"
                        className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md appearance-none bg-white text-base"
                      >
                        <option value="1">1x de 19,90</option>
                        <option value="2">2x de 9,95</option>
                        <option value="3">3x de 6,63</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seção de Resumo da Compra */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 flex items-center text-left">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Sua Compra
            </h2>
            <Card className="border rounded-lg overflow-hidden mb-4">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <img 
                      src={produto.imagem_url || "https://placehold.co/80x80/3b82f6/FFFFFF/png?text=Produto"} 
                      alt={produto.nome} 
                      className="w-14 h-14 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium text-left">{produto.nome}</h3>
                        <p className="text-xs text-gray-500 text-left">OneClick Card</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">R$ {produto.valor.toFixed(2)}</p>
                        <p className="text-xs text-gray-500">1 item</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleComprar} 
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white font-medium text-lg"
            >
              Assine agora
            </Button>
            
            <div className="mt-3 text-center text-xs text-gray-500 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              Outras 106422 visitantes estão finalizando a compra neste momento.
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-4 border-t bg-white mt-auto text-xs text-gray-500 text-center">
        <div className="container max-w-3xl mx-auto">
          <p>Ao clicar em "Assine agora", você é redirecionado para as telas seguras</p>
          <div className="flex justify-between items-center mt-2">
            <p>© Tecnologia Renovar ® 2023 - Todos os direitos reservados</p>
            <p className="text-green-500 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Compra 100% segura
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
