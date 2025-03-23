
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { productSchema } from "./schemas/productSchema";
import { Product, ProductFormValues } from "./types/productTypes";

interface ProductFormProps {
  isCreating: boolean;
  isEditing: boolean;
  selectedProduct: Product | null;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ 
  isCreating, 
  isEditing, 
  selectedProduct, 
  onSubmit, 
  onCancel 
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: selectedProduct?.nome || "",
      tipo: selectedProduct?.tipo || "assinatura",
      valor: selectedProduct?.valor || 0,
      descricao: selectedProduct?.descricao || "",
      ativo: selectedProduct?.ativo !== undefined ? selectedProduct.ativo : true,
      slug: selectedProduct?.slug || "",
      checkout_title: selectedProduct?.checkout_title || "",
      imagem_url: selectedProduct?.imagem_url || "",
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

  const handleFormSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="rounded-md border p-4">
      <h2 className="text-xl font-semibold mb-4">
        {isCreating ? "Criar Produto" : "Editar Produto"}
      </h2>
      <Form {...form}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
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

          <div className="flex space-x-2">
            <Button type="submit" disabled={!form.formState.isValid}>
              {isCreating ? "Criar" : "Salvar"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
