
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { productSchema } from "../schemas/productSchema";

type CheckoutTabProps = {
  form: UseFormReturn<z.infer<typeof productSchema>>;
};

export function CheckoutTab({ form }: CheckoutTabProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="checkout_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título no Checkout</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Compre Agora o Curso Completo!" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="banner_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Banner</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/banner.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="banner_mobile_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL do Banner Mobile</FormLabel>
              <FormControl>
                <Input placeholder="https://exemplo.com/banner-mobile.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="banner_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor do Banner</FormLabel>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: field.value || '#ffffff' }}
                ></div>
                <FormControl>
                  <Input type="text" placeholder="#FF5733" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Código hexadecimal da cor (ex: #FF5733)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="background_color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor de Fundo do Checkout</FormLabel>
              <div className="flex gap-2">
                <div 
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: field.value || '#ffffff' }}
                ></div>
                <FormControl>
                  <Input type="text" placeholder="#FFFFFF" {...field} />
                </FormControl>
              </div>
              <FormDescription>
                Código hexadecimal da cor de fundo (ex: #FFFFFF)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
