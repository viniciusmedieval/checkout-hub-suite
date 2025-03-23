import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductFormValues, productSchema } from "./schemas/productSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";
import { EditIcon, LinkIcon, PackageIcon } from "lucide-react";
import { supabase, Produto } from "@/lib/supabase";

interface Product {
  id: number;
  nome: string;
  tipo: string;
  valor: number;
  descricao: string;
  ativo: boolean;
  slug: string;
  checkout_title: string;
  imagem_url: string;
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order('criado_em', { ascending: false });

      if (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Erro ao buscar produtos. Tente novamente.");
      }

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Erro inesperado ao buscar produtos:", error);
      toast.error("Erro inesperado ao buscar produtos. Tente novamente.");
    }
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: "",
      tipo: "assinatura",
      valor: 0,
      descricao: "",
      ativo: true,
      slug: "",
      checkout_title: "",
      imagem_url: "",
      banner_url: "",
      banner_mobile_url: "",
      banner_color: "",
      tipo_chave_pix: "",
      chave_pix: "",
      nome_beneficiario: "",
      usar_api_pix: false,
      usar_config_pix_global: false,
    },
    mode: "onChange",
  });

  const handleCreateProduct = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedProduct(null);
    form.reset();
  };

  const handleEditProduct = (product: Product) => {
    setIsCreating(false);
    setIsEditing(true);
    setSelectedProduct(product);
    form.reset(product);
  };

  const onSubmit = async (values: ProductFormValues) => {
    try {
      if (isCreating) {
        const { data, error } = await supabase
          .from("produtos")
          .insert([values])
          .select();

        if (error) {
          console.error("Erro ao criar produto:", error);
          toast.error("Erro ao criar produto. Tente novamente.");
          return;
        }

        if (data && data.length > 0) {
          setProducts([...products, data[0] as Product]);
          toast.success("Produto criado com sucesso!");
        }
      }

      if (isEditing && selectedProduct) {
        const { data, error } = await supabase
          .from("produtos")
          .update(values)
          .eq("id", selectedProduct.id)
          .select();

        if (error) {
          console.error("Erro ao atualizar produto:", error);
          toast.error("Erro ao atualizar produto. Tente novamente.");
          return;
        }

        if (data && data.length > 0) {
          const updatedProducts = products.map((product) =>
            product.id === selectedProduct.id ? (data[0] as Product) : product
          );
          setProducts(updatedProducts);
          toast.success("Produto atualizado com sucesso!");
        }
      }
    } catch (error) {
      console.error("Erro inesperado ao salvar produto:", error);
      toast.error("Erro inesperado ao salvar produto. Tente novamente.");
    } finally {
      setIsCreating(false);
      setIsEditing(false);
      setSelectedProduct(null);
      form.reset();
    }
  };

  const copyCheckoutLink = (slug: string) => {
    const baseUrl = window.location.origin;
    const checkoutUrl = `${baseUrl}/checkout/${slug}`;
    
    navigator.clipboard.writeText(checkoutUrl)
      .then(() => {
        toast.success("Link de checkout copiado!");
      })
      .catch(() => {
        toast.error("Erro ao copiar link. Tente novamente.");
      });
  };

  const renderProductList = () => {
    const searchTerm = search.toLowerCase();
    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.nome.toLowerCase().includes(searchTerm) ||
        product.tipo.toLowerCase().includes(searchTerm) ||
        product.descricao.toLowerCase().includes(searchTerm);

      const matchesFilter =
        filter === "todos" ||
        (filter === "ativos" && product.ativo) ||
        (filter === "inativos" && !product.ativo);

      return matchesSearch && matchesFilter;
    });
    
    return (
      <div className="space-y-4 mt-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                {product.imagem_url ? (
                  <img 
                    src={product.imagem_url} 
                    alt={product.nome} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <PackageIcon size={16} />
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{product.nome}</div>
                <div className="text-sm text-gray-500">
                  R$ {product.valor.toFixed(2)} • {product.tipo}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyCheckoutLink(product.slug)}
                className="text-xs h-8 px-2 flex items-center gap-1"
              >
                <LinkIcon size={14} />
                <span className="hidden sm:inline">Copiar Link</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditProduct(product)}
                className="text-xs h-8 px-2 flex items-center gap-1"
              >
                <EditIcon size={14} />
                <span className="hidden sm:inline">Editar</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Produtos</h1>
        <Button onClick={handleCreateProduct}>Criar Produto</Button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <Input
          type="search"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="ativos">Ativos</SelectItem>
            <SelectItem value="inativos">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isCreating || isEditing ? (
        <div className="rounded-md border p-4">
          <h2 className="text-xl font-semibold mb-4">
            {isCreating ? "Criar Produto" : "Editar Produto"}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="assinatura">Assinatura</SelectItem>
                        <SelectItem value="unico">Produto Único</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descrição do produto"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ativo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <FormDescription>
                        Defina se o produto está disponível para venda.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="URL amigável do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="checkout_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título do Checkout</FormLabel>
                    <FormControl>
                      <Input placeholder="Título da página de checkout" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imagem_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="URL da imagem do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={!form.formState.isValid}>
                {isCreating ? "Criar" : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(false);
                  setSelectedProduct(null);
                  form.reset();
                }}
              >
                Cancelar
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        renderProductList()
      )}
    </div>
  );
}
