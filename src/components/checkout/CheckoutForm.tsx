
import { ConfigCheckout } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface CheckoutFormProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutForm({ configCheckout }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    observacoes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Process checkout form submission
  };

  return (
    <div className="checkout-form bg-black rounded-lg overflow-hidden">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-white">Informações de Contato</h2>
        
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-white">Nome completo</Label>
          <Input 
            id="nome"
            name="nome"
            placeholder="Digite seu nome completo"
            value={formData.nome}
            onChange={handleChange}
            required
            className="bg-black border-[#333] text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">E-mail</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-black border-[#333] text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="telefone" className="text-white">Telefone</Label>
          <Input 
            id="telefone"
            name="telefone"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="bg-black border-[#333] text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endereco" className="text-white">Endereço (opcional)</Label>
          <Input 
            id="endereco"
            name="endereco"
            placeholder="Seu endereço completo"
            value={formData.endereco}
            onChange={handleChange}
            className="bg-black border-[#333] text-white placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="observacoes" className="text-white">Observações (opcional)</Label>
          <Textarea 
            id="observacoes"
            name="observacoes"
            placeholder="Alguma observação adicional?"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
            className="bg-black border-[#333] text-white placeholder:text-gray-500"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-6 text-lg font-medium mt-4 bg-[#1E88E5] hover:bg-[#1976D2]"
        >
          {configCheckout?.texto_botao || "FINALIZAR COMPRA"}
        </Button>
      </form>
    </div>
  );
}
