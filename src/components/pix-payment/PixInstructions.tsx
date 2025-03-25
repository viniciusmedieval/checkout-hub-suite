
import React, { useState, useEffect } from "react";
import { Info, ArrowRight } from "lucide-react";
import { PixMensagem } from "@/lib/types/database-types";
import { supabase } from "@/integrations/supabase/client";

interface PixInstructionsProps {
  pixInstructions: string;
  pixSecurityMessage: string;
}

export function PixInstructions({ pixInstructions, pixSecurityMessage }: PixInstructionsProps) {
  const [messages, setMessages] = useState<PixMensagem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch PIX instructions from database
  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("pix_mensagens")
          .select("*")
          .eq("ativo", true)
          .order("ordem");

        if (error) {
          console.error("Erro ao carregar instruções PIX:", error);
        } else if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error("Erro ao buscar mensagens PIX:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, []);

  return (
    <div className="border-t border-gray-100 pt-4 mt-4">
      <h3 className="text-gray-700 font-medium mb-3">{pixInstructions}</h3>
      
      {loading ? (
        <div className="py-2 text-sm text-gray-500">Carregando instruções...</div>
      ) : messages.length > 0 ? (
        <ol className="space-y-4 text-sm text-gray-600">
          {messages.map((message) => (
            <li key={message.id} className="flex gap-2">
              <span className="font-semibold text-gray-700">{message.titulo}</span>
              <span>{message.texto}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="space-y-4 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="font-semibold text-gray-700">1</span>
            <span>Abra o aplicativo do seu banco;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-gray-700">2</span>
            <span>Escolha a opção PIX e cole o código ou use a câmera do celular para pagar com QR Code;</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-gray-700">3</span>
            <span>Confirme as informações e finalize o pagamento.</span>
          </li>
        </ol>
      )}
      
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mt-4 flex gap-2 text-sm text-yellow-800">
        <div className="shrink-0 mt-0.5">
          <Info size={16} className="text-yellow-600" />
        </div>
        <p>{pixSecurityMessage}</p>
      </div>
      
      <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4">
        <details className="group">
          <summary className="flex justify-between items-center cursor-pointer list-none text-gray-700 font-medium">
            <span>Saiba mais</span>
            <span className="transition group-open:rotate-180">
              <ArrowRight size={16} />
            </span>
          </summary>
          <div className="mt-3 space-y-4">
            <div className="flex flex-wrap justify-around gap-2 pt-2">
              <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                <p className="text-xs">Nubank</p>
              </div>
              <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                <p className="text-xs">Itaú</p>
              </div>
              <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                <p className="text-xs">Bradesco</p>
              </div>
              <div className="bg-white p-2 rounded-md border border-gray-200 w-20 text-center">
                <p className="text-xs">Santander</p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
