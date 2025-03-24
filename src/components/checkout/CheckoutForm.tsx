
import { ConfigCheckout } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatPhoneNumber, formatCPF } from "@/utils/formatters";
import { User, Mail, Smartphone, FileText } from "lucide-react";

interface CheckoutFormProps {
  configCheckout?: ConfigCheckout | null;
  formData?: {
    nome: string;
    email: string;
    telefone: string;
    documento: string;
  };
  onChange?: (name: string, value: string) => void;
  errors?: Record<string, boolean>;
}

export function CheckoutForm({ configCheckout, formData = { nome: "", email: "", telefone: "", documento: "" }, onChange, errors = {} }: CheckoutFormProps) {
  const [localFormData, setLocalFormData] = useState(formData);
  const [localErrors, setLocalErrors] = useState(errors);

  // Determine whether to show optional fields
  const showDocumento = configCheckout?.mostrar_campo_documento !== false;
  const showTelefone = configCheckout?.mostrar_campo_telefone !== false;
  
  // Use custom title from config or default
  const titleIdentificacao = configCheckout?.titulo_identificacao || "Identificação";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Reset error for field
    if (localErrors[name]) {
      setLocalErrors(prev => ({ ...prev, [name]: false }));
    }
    
    // Format input values if needed
    let formattedValue = value;
    if (name === 'telefone') {
      formattedValue = formatPhoneNumber(value);
    } else if (name === 'documento') {
      formattedValue = formatCPF(value);
    }
    
    setLocalFormData(prev => ({ ...prev, [name]: formattedValue }));
    
    // Call parent onChange if provided
    if (onChange) {
      onChange(name, formattedValue);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold mb-3 text-black">{titleIdentificacao}</h2>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
            <User size={16} className="text-purple-500" />
          </div>
          <Input 
            id="nome"
            name="nome"
            placeholder="Nome completo"
            value={onChange ? formData.nome : localFormData.nome}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.nome || localErrors.nome ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
          />
          {(errors.nome || localErrors.nome) && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
            <Mail size={16} className="text-purple-500" />
          </div>
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="Seu e-mail"
            value={onChange ? formData.email : localFormData.email}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.email || localErrors.email ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
          />
          {(errors.email || localErrors.email) && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
        </div>
        
        <div className={`grid ${showDocumento && showTelefone ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
          {showTelefone && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <Smartphone size={16} className="text-purple-500" />
              </div>
              <Input 
                id="telefone"
                name="telefone"
                placeholder="Celular"
                value={onChange ? formData.telefone : localFormData.telefone}
                onChange={handleChange}
                className={`pl-9 h-10 text-sm ${errors.telefone || localErrors.telefone ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {(errors.telefone || localErrors.telefone) && <p className="text-red-500 text-xs mt-1">Celular inválido</p>}
            </div>
          )}
          
          {showDocumento && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <FileText size={16} className="text-purple-500" />
              </div>
              <Input 
                id="documento"
                name="documento"
                placeholder="CPF/CNPJ"
                value={onChange ? formData.documento : localFormData.documento}
                onChange={handleChange}
                className={`pl-9 h-10 text-sm ${errors.documento || localErrors.documento ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {(errors.documento || localErrors.documento) && <p className="text-red-500 text-xs mt-1">Documento inválido</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
