
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Depoimento } from "@/lib/supabase";

const depoimentoSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  texto: z.string().min(10, "Depoimento deve ter pelo menos 10 caracteres"),
  estrelas: z.number().min(1).max(5),
  foto_url: z.string().url("URL inválida").optional().or(z.literal("")),
  produto_id: z.number().optional(),
});

type DepoimentoFormValues = z.infer<typeof depoimentoSchema>;

interface NovoDepoimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (depoimento: Omit<Depoimento, "id" | "criado_em">) => Promise<void>;
  isSaving: boolean;
}

export function NovoDepoimentoModal({
  isOpen,
  onClose,
  onSubmit,
  isSaving,
}: NovoDepoimentoModalProps) {
  const [selectedRating, setSelectedRating] = useState(5);
  
  const form = useForm<DepoimentoFormValues>({
    resolver: zodResolver(depoimentoSchema),
    defaultValues: {
      nome: "",
      texto: "",
      estrelas: 5,
      foto_url: "",
      produto_id: 0,
    },
  });

  const handleSubmit = async (values: DepoimentoFormValues) => {
    // Make sure to include all required properties and ensure they are non-optional
    const depoimento = {
      nome: values.nome, // Ensure nome is always provided
      texto: values.texto, // Ensure texto is always provided
      estrelas: selectedRating,
      produto_id: values.produto_id || 0, // Provide a default if undefined
      // If no photo URL is provided, use a default avatar
      foto_url: values.foto_url || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
    };
    
    await onSubmit(depoimento);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Depoimento</DialogTitle>
          <DialogDescription>
            Adicione um novo depoimento para ser exibido no checkout.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Avaliação</FormLabel>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setSelectedRating(star);
                      form.setValue("estrelas", star);
                    }}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={star <= selectedRating ? "#FFD700" : "none"}
                      stroke={star <= selectedRating ? "#FFD700" : "#D1D5DB"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="cursor-pointer"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
            </FormItem>
            
            <FormField
              control={form.control}
              name="texto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Depoimento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="O que o cliente achou do produto?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="foto_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Foto (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
