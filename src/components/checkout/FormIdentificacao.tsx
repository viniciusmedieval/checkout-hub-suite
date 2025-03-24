
import { Input } from "@/components/ui/input";
import { formatPhoneNumber, formatCPF } from "@/utils/formatters";
import { FormData } from "@/hooks/checkout"; // Updated import path
import { ConfigCheckout } from "@/lib/supabase";
import { DynamicIcon } from "./utils/DynamicIcon";

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

  // Get icon configuration from config or use defaults
  const iconColor = configCheckout?.cor_icones || "#8a898c";
  const nomeIconName = configCheckout?.icone_nome || "user";
  const emailIconName = configCheckout?.icone_email || "mail";
  const telefoneIconName = "brasil-flag"; // Sempre usar a bandeira do Brasil para telefone
  const documentoIconName = configCheckout?.icone_documento || "file-text";

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
            <DynamicIcon 
              name={nomeIconName} 
              size={16} 
              color={iconColor} 
            />
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
            <DynamicIcon 
              name={emailIconName} 
              size={16} 
              color={iconColor} 
            />
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
          {showDocumento && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <DynamicIcon 
                  name={documentoIconName} 
                  size={16} 
                  color={iconColor} 
                />
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
          
          {showTelefone && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 flex items-center">
                <DynamicIcon 
                  name={telefoneIconName} 
                  size={14}
                />
                <span className="ml-1">+55</span>
              </div>
              <Input 
                id="telefone"
                name="telefone"
                placeholder="Celular"
                value={formData.telefone}
                onChange={handleChange}
                className={`pl-16 h-10 text-sm ${errors.telefone ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {errors.telefone && <p className="text-red-500 text-xs mt-1">Celular inválido</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
