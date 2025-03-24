
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProductFormValues } from "../types/productTypes";

interface CheckoutSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

export function CheckoutSection({ form }: CheckoutSectionProps) {
  return (
    <>
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
        name="checkout_button_text"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Texto do Botão de Checkout</FormLabel>
            <FormControl>
              <Input placeholder="Ex: COMPRAR AGORA" {...field} />
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
    </>
  );
}
