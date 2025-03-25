
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { productSchema } from "./schemas/productSchema";
import { Product, ProductFormValues } from "./types/productTypes";
import { BasicInfoSection } from "./form-sections/BasicInfoSection";
import { VisibilitySection } from "./form-sections/VisibilitySection";
import { CheckoutSection } from "./form-sections/CheckoutSection";
import { FormActions } from "./form-sections/FormActions";

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
      checkout_button_text: selectedProduct?.checkout_button_text || "",
      imagem_url: selectedProduct?.imagem_url || "",
      banner_url: selectedProduct?.banner_url || "",
      banner_mobile_url: selectedProduct?.banner_mobile_url || "",
      banner_color: selectedProduct?.banner_color || "",
      background_color: selectedProduct?.background_color || "",
      tipo_chave_pix: selectedProduct?.tipo_chave_pix || "",
      chave_pix: selectedProduct?.chave_pix || "",
      nome_beneficiario: selectedProduct?.nome_beneficiario || "",
      usar_api_pix: selectedProduct?.usar_api_pix || false,
      usar_config_pix_global: selectedProduct?.usar_config_pix_global || false,
      url_api_pix: selectedProduct?.url_api_pix || "",
      url_pix_api: selectedProduct?.url_pix_api || "",
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
          <BasicInfoSection form={form} />
          <VisibilitySection form={form} />
          <CheckoutSection form={form} />
          <FormActions isCreating={isCreating} onCancel={onCancel} />
        </form>
      </Form>
    </div>
  );
}
