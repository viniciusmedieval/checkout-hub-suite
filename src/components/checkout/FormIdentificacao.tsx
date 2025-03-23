
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <h2 className="text-base font-semibold mb-4">Identificação</h2>
      
      <div className="space-y-4">
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
            className={`pl-10 h-11 text-sm rounded-lg ${errors.nome ? 'border-red-500' : 'border-gray-200'}`}
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
            className={`pl-10 h-11 text-sm rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">E-mail inválido</p>}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className={`pl-10 h-11 text-sm rounded-lg ${errors.telefone ? 'border-red-500' : 'border-gray-200'}`}
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
              className={`pl-10 h-11 text-sm rounded-lg ${errors.documento ? 'border-red-500' : 'border-gray-200'}`}
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
            className="pl-10 resize-none text-sm rounded-lg border-gray-200"
          />
        </div>
      </div>
    </div>
  );
}
