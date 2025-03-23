
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, Mail, FileText, MessageSquare, CheckCircle } from "lucide-react";
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

  // Validate email in real-time
  const isEmailValid = formData.email 
    ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) 
    : true;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="text-base font-semibold mb-3">Identificação</h2>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <User size={16} />
          </div>
          {formData.nome && !errors.nome && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle size={16} />
            </div>
          )}
          <Input 
            id="nome"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.nome ? 'border-red-500' : ''}`}
          />
          {errors.nome && <p className="text-red-500 text-xs mt-1">Nome é obrigatório</p>}
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Mail size={16} />
          </div>
          {formData.email && isEmailValid && !errors.email && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle size={16} />
            </div>
          )}
          <Input 
            id="email"
            name="email"
            type="email"
            placeholder="Seu e-mail"
            value={formData.email}
            onChange={handleChange}
            className={`pl-9 h-10 text-sm ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone size={16} />
            </div>
            {formData.telefone && formData.telefone.replace(/\D/g, '').length >= 10 && !errors.telefone && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                <CheckCircle size={16} />
              </div>
            )}
            <Input 
              id="telefone"
              name="telefone"
              placeholder="Celular"
              value={formData.telefone}
              onChange={handleChange}
              className={`pl-9 h-10 text-sm ${errors.telefone ? 'border-red-500' : ''}`}
            />
            {errors.telefone && <p className="text-red-500 text-xs mt-1">Celular inválido</p>}
          </div>
          
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FileText size={16} />
            </div>
            {formData.documento && formData.documento.replace(/\D/g, '').length >= 11 && !errors.documento && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                <CheckCircle size={16} />
              </div>
            )}
            <Input 
              id="documento"
              name="documento"
              placeholder="CPF/CNPJ"
              value={formData.documento}
              onChange={handleChange}
              className={`pl-9 h-10 text-sm ${errors.documento ? 'border-red-500' : ''}`}
            />
            {errors.documento && <p className="text-red-500 text-xs mt-1">Documento inválido</p>}
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute left-3 top-3 text-gray-400">
            <MessageSquare size={16} />
          </div>
          <Textarea 
            id="observacoes"
            name="observacoes"
            placeholder="Observações (opcional)"
            value={formData.observacoes}
            onChange={handleChange}
            rows={2}
            className="pl-9 resize-none text-sm"
          />
        </div>
      </div>
    </div>
  );
}
