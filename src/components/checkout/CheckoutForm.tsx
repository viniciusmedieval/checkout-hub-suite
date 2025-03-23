
import { ConfigCheckout } from "@/lib/supabase";
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
    <div className="checkout-form">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-base font-semibold mb-3 text-gray-800">Identificação</h2>
        
        <div className="space-y-1">
          <Label htmlFor="nome" className="text-sm text-gray-700">Nome completo</Label>
          <Input 
            id="nome"
            name="nome"
            placeholder="Digite seu nome completo"
            value={formData.nome}
            onChange={handleChange}
            required
            className="h-9 text-sm bg-white border-gray-300 text-black placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm text-gray-700">E-mail</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-9 text-sm bg-white border-gray-300 text-black placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="telefone" className="text-sm text-gray-700">Telefone</Label>
          <Input 
            id="telefone"
            name="telefone"
            placeholder="(00) 00000-0000"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="h-9 text-sm bg-white border-gray-300 text-black placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="endereco" className="text-sm text-gray-700">Endereço (opcional)</Label>
          <Input 
            id="endereco"
            name="endereco"
            placeholder="Seu endereço completo"
            value={formData.endereco}
            onChange={handleChange}
            className="h-9 text-sm bg-white border-gray-300 text-black placeholder:text-gray-500"
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="observacoes" className="text-sm text-gray-700">Observações (opcional)</Label>
          <Textarea 
            id="observacoes"
            name="observacoes"
            placeholder="Alguma observação adicional?"
            value={formData.observacoes}
            onChange={handleChange}
            rows={2}
            className="text-sm bg-white border-gray-300 text-black placeholder:text-gray-500"
          />
        </div>
        
        {/* Botão de finalizar compra será movido para o CheckoutSummary */}
      </form>
    </div>
  );
}
