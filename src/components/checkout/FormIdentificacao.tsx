
import { Input } from "@/components/ui/input";
import { formatPhoneNumber, formatCPF } from "@/utils/formatters";
import { FormData } from "@/hooks/useCheckout";
import { ConfigCheckout } from "@/lib/supabase";
import { User, Mail, Smartphone, FileText } from "lucide-react";

interface FormIdentificacaoProps {
  formData: FormData;
  errors: Record<string, boolean>;
  onChange: (name: string, value: string) => void;
  configCheckout?: ConfigCheckout | null;
}

export function FormIdentificacao({ 
  formData, 
  errors, 
  onChange,
  configCheckout 
}: FormIdentificacaoProps) {
  // Determine whether to show optional fields based on config
  const showDocumento = configCheckout?.mostrar_campo_documento !== false;
  const showTelefone = configCheckout?.mostrar_campo_telefone !== false;
  
  // Use custom title from config or default
  const titleIdentificacao = configCheckout?.titulo_identificacao || "Identificação";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format input values if needed
    if (name === 'telefone') {
      onChange(name, formatPhoneNumber(value));
    } else if (name === 'documento') {
      onChange(name, formatCPF(value));
    } else {
      onChange(name, value);
    }
  };

  return (
    <div className="space-y-4 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-base font-semibold mb-3 text-black">{titleIdentificacao}</h2>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
            <User size={16} className="text-gray-500" />
          </div>
          <Input 
            id="nome"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.nome ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
          />
          {errors.nome && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
            <Mail size={16} className="text-gray-500" />
          </div>
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
        </div>
        
        <div className={`grid ${showDocumento && showTelefone ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
          {showTelefone && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <Smartphone size={16} className="text-gray-500" />
              </div>
              <Input 
                id="telefone"
                name="telefone"
                placeholder="Celular"
                value={formData.telefone}
                onChange={handleChange}
                className={`pl-9 h-10 text-sm ${errors.telefone ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">Celular inválido</p>}
            </div>
          )}
          
          {showDocumento && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <FileText size={16} className="text-gray-500" />
              </div>
              <Input 
                id="documento"
                name="documento"
                placeholder="CPF/CNPJ"
                value={formData.documento}
                onChange={handleChange}
                className={`pl-9 h-10 text-sm ${errors.documento ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {errors.documento && <p className="text-red-500 text-xs mt-1">Documento inválido</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
