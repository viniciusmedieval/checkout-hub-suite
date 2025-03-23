
import { Input } from "@/components/ui/input";
import { User, Phone, Mail, FileText } from "lucide-react";
import { ChangeEvent } from "react";
import { formatPhoneNumber, formatCPF } from "@/utils/formatters";
import { FormData } from "@/hooks/useCheckout";

interface FormIdentificacaoProps {
  formData: FormData;
  errors: Record<string, boolean>;
  onChange: (name: string, value: string) => void;
}

export function FormIdentificacao({ formData, errors, onChange }: FormIdentificacaoProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'telefone') {
      onChange(name, formatPhoneNumber(value));
    } else if (name === 'documento') {
      onChange(name, formatCPF(value));
    } else {
      onChange(name, value);
    }
  };

  // CPF validation function
  const validateCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    
    // Must be 11 digits
    if (cleanCPF.length !== 11) return false;
    
    // First verification digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    let digit1 = remainder > 9 ? 0 : remainder;
    
    // Second verification digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    let digit2 = remainder > 9 ? 0 : remainder;
    
    // Check if calculated verification digits match with the given digits
    return (
      parseInt(cleanCPF.charAt(9)) === digit1 &&
      parseInt(cleanCPF.charAt(10)) === digit2
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-6">
        <User size={18} className="text-gray-700" />
        <h2 className="text-base font-semibold text-black">Identificação</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome completo
            </label>
            <Input 
              id="nome"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              className={`h-11 text-sm rounded-lg ${errors.nome ? 'border-red-500' : 'border-gray-200'} bg-white text-black`}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <Input 
              id="email"
              name="email"
              type="email"
              placeholder="Seu e-mail"
              value={formData.email}
              onChange={handleChange}
              className={`h-11 text-sm rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'} bg-white text-black`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
              CPF/CNPJ
            </label>
            <Input 
              id="documento"
              name="documento"
              placeholder="CPF/CNPJ"
              value={formData.documento}
              onChange={handleChange}
              className={`h-11 text-sm rounded-lg ${errors.documento ? 'border-red-500' : 'border-gray-200'} bg-white text-black`}
            />
            {errors.documento && <p className="text-red-500 text-xs mt-1">
              {formData.documento && !validateCPF(formData.documento) 
                ? "CPF inválido" 
                : "Documento inválido"}
            </p>}
          </div>
          
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
              Celular
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="flex items-center">
                  <span className="mr-1">🇧🇷</span>
                  <span className="text-sm text-gray-500">+55</span>
                </div>
              </div>
              <Input 
                id="telefone"
                name="telefone"
                placeholder="Celular"
                value={formData.telefone}
                onChange={handleChange}
                className={`pl-16 h-11 text-sm rounded-lg ${errors.telefone ? 'border-red-500' : 'border-gray-200'} bg-white text-black`}
              />
            </div>
            {errors.telefone && <p className="text-red-500 text-xs mt-1">Celular inválido</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
