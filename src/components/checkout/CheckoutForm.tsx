
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

export function CheckoutForm() {
  return (
    <Card className="border border-[#353535] bg-[#1D1D1D]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className="text-[#FF914D]" />
          <h3 className="text-sm font-medium">Identificação</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="nome" className="text-xs text-gray-400">Nome completo</label>
            <Input 
              id="nome" 
              placeholder="Seu nome completo" 
              className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs text-gray-400">E-mail</label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Seu e-mail" 
              className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="cpf" className="text-xs text-gray-400">CPF (Opcional)</label>
            <Input 
              id="cpf" 
              placeholder="Apenas números CPF/CNPJ" 
              className="bg-[#2A2A2A] border-[#353535] focus:border-[#FF914D] text-white" 
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="telefone" className="text-xs text-gray-400">Celular</label>
            <div className="flex items-center">
              <div className="flex gap-1 items-center bg-[#2A2A2A] border border-[#353535] px-2 rounded-l-md h-10">
                <span className="text-sm text-gray-400">+55</span>
              </div>
              <Input 
                id="telefone" 
                placeholder="(XX) XXXXX-XXXX" 
                className="bg-[#2A2A2A] border-[#353535] rounded-l-none focus:border-[#FF914D] text-white" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
