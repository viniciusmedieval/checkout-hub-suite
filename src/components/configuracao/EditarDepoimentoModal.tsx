
import { useState, useEffect } from "react";
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

interface EditarDepoimentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (depoimento: Partial<Depoimento>) => Promise<void>;
  depoimento: Depoimento;
  isSaving: boolean;
}

export function EditarDepoimentoModal({
  isOpen,
  onClose,
  onSubmit,
  depoimento,
  isSaving,
}: EditarDepoimentoModalProps) {
  const [selectedRating, setSelectedRating] = useState(depoimento.estrelas);
  
  const form = useForm<DepoimentoFormValues>({
    resolver: zodResolver(depoimentoSchema),
    defaultValues: {
      nome: depoimento.nome,
      texto: depoimento.texto,
      estrelas: depoimento.estrelas,
      foto_url: depoimento.foto_url || "",
      produto_id: depoimento.produto_id || 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        nome: depoimento.nome,
        texto: depoimento.texto,
        estrelas: depoimento.estrelas,
        foto_url: depoimento.foto_url || "",
        produto_id: depoimento.produto_id || 0,
      });
      setSelectedRating(depoimento.estrelas);
    }
  }, [isOpen, depoimento, form]);

  const handleSubmit = async (values: DepoimentoFormValues) => {
    // Prepare updated fields
    const updatedDepoimento = {
      nome: values.nome,
      texto: values.texto,
      estrelas: selectedRating,
      foto_url: values.foto_url || depoimento.foto_url,
      produto_id: values.produto_id || depoimento.produto_id || 0,
    };
    
    await onSubmit(updatedDepoimento);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Depoimento</DialogTitle>
          <DialogDescription>
            Edite as informações do depoimento.
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
                  <FormLabel>URL da Foto</FormLabel>
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
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
