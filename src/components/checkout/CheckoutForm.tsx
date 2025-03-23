
import { ConfigCheckout } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { User, Phone, Mail, FileText } from "lucide-react";
import { formatPhoneNumber, formatCPF } from "@/utils/formatters";

interface CheckoutFormProps {
  configCheckout?: ConfigCheckout | null;
}

export function CheckoutForm({ configCheckout }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    documento: ""
  });

  const [errors, setErrors] = useState({
    nome: false,
    email: false,
    telefone: false,
    documento: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset error for field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
    
    // Format input values if needed
    if (name === 'telefone') {
      setFormData(prev => ({ ...prev, [name]: formatPhoneNumber(value) }));
    } else if (name === 'documento') {
      setFormData(prev => ({ ...prev, [name]: formatCPF(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold mb-3 text-black">Identificação</h2>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={16} />
          </div>
          <Input 
            id="nome"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.nome ? 'border-red-500' : ''} bg-white text-black`}
          />
          {errors.nome && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={16} />
          </div>
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.email ? 'border-red-500' : ''} bg-white text-black`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={16} />
            </div>
            <Input 
              id="telefone"
              name="telefone"
              placeholder="Celular"
              value={formData.telefone}
              onChange={handleChange}
              className={`pl-9 h-10 text-sm ${errors.telefone ? 'border-red-500' : ''} bg-white text-black`}
            />
            {errors.telefone && <p className="text-red-500 text-xs mt-1">Celular inválido</p>}
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FileText size={16} />
            </div>
            <Input 
              id="documento"
              name="documento"
              placeholder="CPF/CNPJ"
              value={formData.documento}
              onChange={handleChange}
              className={`pl-9 h-10 text-sm ${errors.documento ? 'border-red-500' : ''} bg-white text-black`}
            />
            {errors.documento && <p className="text-red-500 text-xs mt-1">Documento inválido</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
