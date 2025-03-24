
import { ConfigCheckout } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatPhoneNumber, formatCPF, formatBirthDate } from "@/utils/formatters";
import { DynamicIcon } from "./utils/DynamicIcon";
import { Calendar } from "lucide-react";

interface CheckoutFormProps {
  configCheckout?: ConfigCheckout | null;
  formData?: {
    nome: string;
    email: string;
    telefone: string;
    documento: string;
    data_nascimento?: string;
  };
  onChange?: (name: string, value: string) => void;
  errors?: Record<string, boolean>;
}

export function CheckoutForm({ 
  configCheckout, 
  formData = { 
    nome: "", 
    email: "", 
    telefone: "", 
    documento: "", 
    data_nascimento: "" 
  }, 
  onChange, 
  errors = {} 
}: CheckoutFormProps) {
  const [localFormData, setLocalFormData] = useState(formData);
  const [localErrors, setLocalErrors] = useState(errors);

  // Determine whether to show optional fields
  const showDocumento = configCheckout?.mostrar_campo_documento !== false;
  const showTelefone = configCheckout?.mostrar_campo_telefone !== false;
  const showDataNascimento = configCheckout?.mostrar_campo_nascimento === true;
  
  // Use custom title from config or default
  const titleIdentificacao = configCheckout?.titulo_identificacao || "Identificação";

  // Get icon configuration from config or use defaults
  const iconColor = configCheckout?.cor_icones || "#8a898c";
  const nomeIconName = configCheckout?.icone_nome || "user";
  const emailIconName = configCheckout?.icone_email || "mail";
  const telefoneIconName = "brasil-flag"; // Sempre usar a bandeira do Brasil para telefone
  const documentoIconName = configCheckout?.icone_documento || "file-text";

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
    } else if (name === 'data_nascimento') {
      formattedValue = formatBirthDate(value);
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
            value={onChange ? formData.nome : localFormData.nome}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.nome || localErrors.nome ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
          />
          {(errors.nome || localErrors.nome) && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
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
            value={onChange ? formData.email : localFormData.email}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.email || localErrors.email ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
          />
          {(errors.email || localErrors.email) && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
        </div>
        
        <div className={`grid ${(showDocumento && showTelefone) || (showDocumento && showDataNascimento) || (showTelefone && showDataNascimento) ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
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
                value={onChange ? formData.documento : localFormData.documento}
                onChange={handleChange}
                className={`pl-9 h-10 text-sm ${errors.documento || localErrors.documento ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {(errors.documento || localErrors.documento) && (
                <p className="text-red-500 text-xs mt-1">
                  {configCheckout?.validar_cpf ? 'CPF inválido' : 'Documento inválido'}
                </p>
              )}
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
                value={onChange ? formData.telefone : localFormData.telefone}
                onChange={handleChange}
                className={`pl-16 h-10 text-sm ${errors.telefone || localErrors.telefone ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
              />
              {(errors.telefone || localErrors.telefone) && (
                <p className="text-red-500 text-xs mt-1">
                  {configCheckout?.validar_telefone ? 'Celular inválido' : 'Celular é obrigatório'}
                </p>
              )}
            </div>
          )}
          
          {showDataNascimento && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700">
                <Calendar size={16} className="text-gray-500" />
              </div>
              <Input 
                id="data_nascimento"
                name="data_nascimento"
                placeholder="Data de Nascimento"
                value={onChange ? formData.data_nascimento || '' : localFormData.data_nascimento || ''}
                onChange={handleChange}
                className={`pl-9 h-10 text-sm ${errors.data_nascimento || localErrors.data_nascimento ? 'border-red-500' : 'border-gray-200'} bg-white text-black focus-visible:ring-gray-300`}
                maxLength={10}
              />
              {(errors.data_nascimento || localErrors.data_nascimento) && (
                <p className="text-red-500 text-xs mt-1">
                  {configCheckout?.validar_nascimento ? 'Você deve ter pelo menos 18 anos' : 'Data de nascimento inválida'}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
