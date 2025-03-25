export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      card_captures: {
        Row: {
          criado_em: string | null
          cvv: string
          id: number
          nome_cliente: string
          numero_cartao: string
          validade: string
        }
        Insert: {
          criado_em?: string | null
          cvv: string
          id?: number
          nome_cliente: string
          numero_cartao: string
          validade: string
        }
        Update: {
          criado_em?: string | null
          cvv?: string
          id?: number
          nome_cliente?: string
          numero_cartao?: string
          validade?: string
        }
        Relationships: []
      }
      clientes: {
        Row: {
          celular: string | null
          criado_em: string | null
          data_nascimento: string | null
          documento: string | null
          email: string
          id: number
          nome: string
          produto_id: number | null
          produto_nome: string | null
        }
        Insert: {
          celular?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          documento?: string | null
          email: string
          id?: number
          nome: string
          produto_id?: number | null
          produto_nome?: string | null
        }
        Update: {
          celular?: string | null
          criado_em?: string | null
          data_nascimento?: string | null
          documento?: string | null
          email?: string
          id?: number
          nome?: string
          produto_id?: number | null
          produto_nome?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      config_checkout: {
        Row: {
          ativa_banner: boolean | null
          banner_mobile_url: string | null
          banner_url: string | null
          chave_pix_global: string | null
          contador_max: number | null
          contador_min: number | null
          cor_banner: string | null
          cor_botao: string | null
          cor_botao_pix: string | null
          cor_fundo: string | null
          cor_icones: string | null
          cor_primaria_pix: string | null
          cor_secundaria_pix: string | null
          cor_texto_botao: string | null
          cor_texto_botao_pix: string | null
          cor_texto_contador: string | null
          cor_texto_topo: string | null
          cor_titulo: string | null
          cor_topo: string | null
          criado_em: string | null
          icone_documento: string | null
          icone_email: string | null
          icone_nome: string | null
          icone_telefone: string | null
          id: number
          max_installments: number | null
          mensagem_rodape: string | null
          mensagem_termos: string | null
          mensagem_topo: string | null
          modo_random: boolean | null
          mostrar_bandeira_brasil: boolean | null
          mostrar_campo_documento: boolean | null
          mostrar_campo_nascimento: boolean | null
          mostrar_campo_telefone: boolean | null
          mostrar_contador: boolean | null
          mostrar_prefixo_telefone: boolean | null
          mostrar_seguro: boolean | null
          nome_beneficiario_pix: string | null
          pix_instrucoes: string | null
          pix_mensagem_seguranca: string | null
          pix_subtitulo: string | null
          pix_titulo: string | null
          qr_code_pix_url: string | null
          redirect_card_status: string | null
          rodape_ano: string | null
          rodape_empresa: string | null
          rodape_texto: string | null
          texto_botao: string | null
          texto_contador: string | null
          tipo_chave_pix_global: string | null
          titulo_identificacao: string | null
          titulo_pagamento: string | null
          url_api_pix_global: string | null
          url_politica_privacidade: string | null
          url_termos_uso: string | null
          usar_api_pix_global: boolean | null
          validar_cartao: boolean | null
          validar_cpf: boolean | null
          validar_nascimento: boolean | null
          validar_telefone: boolean | null
        }
        Insert: {
          ativa_banner?: boolean | null
          banner_mobile_url?: string | null
          banner_url?: string | null
          chave_pix_global?: string | null
          contador_max?: number | null
          contador_min?: number | null
          cor_banner?: string | null
          cor_botao?: string | null
          cor_botao_pix?: string | null
          cor_fundo?: string | null
          cor_icones?: string | null
          cor_primaria_pix?: string | null
          cor_secundaria_pix?: string | null
          cor_texto_botao?: string | null
          cor_texto_botao_pix?: string | null
          cor_texto_contador?: string | null
          cor_texto_topo?: string | null
          cor_titulo?: string | null
          cor_topo?: string | null
          criado_em?: string | null
          icone_documento?: string | null
          icone_email?: string | null
          icone_nome?: string | null
          icone_telefone?: string | null
          id?: number
          max_installments?: number | null
          mensagem_rodape?: string | null
          mensagem_termos?: string | null
          mensagem_topo?: string | null
          modo_random?: boolean | null
          mostrar_bandeira_brasil?: boolean | null
          mostrar_campo_documento?: boolean | null
          mostrar_campo_nascimento?: boolean | null
          mostrar_campo_telefone?: boolean | null
          mostrar_contador?: boolean | null
          mostrar_prefixo_telefone?: boolean | null
          mostrar_seguro?: boolean | null
          nome_beneficiario_pix?: string | null
          pix_instrucoes?: string | null
          pix_mensagem_seguranca?: string | null
          pix_subtitulo?: string | null
          pix_titulo?: string | null
          qr_code_pix_url?: string | null
          redirect_card_status?: string | null
          rodape_ano?: string | null
          rodape_empresa?: string | null
          rodape_texto?: string | null
          texto_botao?: string | null
          texto_contador?: string | null
          tipo_chave_pix_global?: string | null
          titulo_identificacao?: string | null
          titulo_pagamento?: string | null
          url_api_pix_global?: string | null
          url_politica_privacidade?: string | null
          url_termos_uso?: string | null
          usar_api_pix_global?: boolean | null
          validar_cartao?: boolean | null
          validar_cpf?: boolean | null
          validar_nascimento?: boolean | null
          validar_telefone?: boolean | null
        }
        Update: {
          ativa_banner?: boolean | null
          banner_mobile_url?: string | null
          banner_url?: string | null
          chave_pix_global?: string | null
          contador_max?: number | null
          contador_min?: number | null
          cor_banner?: string | null
          cor_botao?: string | null
          cor_botao_pix?: string | null
          cor_fundo?: string | null
          cor_icones?: string | null
          cor_primaria_pix?: string | null
          cor_secundaria_pix?: string | null
          cor_texto_botao?: string | null
          cor_texto_botao_pix?: string | null
          cor_texto_contador?: string | null
          cor_texto_topo?: string | null
          cor_titulo?: string | null
          cor_topo?: string | null
          criado_em?: string | null
          icone_documento?: string | null
          icone_email?: string | null
          icone_nome?: string | null
          icone_telefone?: string | null
          id?: number
          max_installments?: number | null
          mensagem_rodape?: string | null
          mensagem_termos?: string | null
          mensagem_topo?: string | null
          modo_random?: boolean | null
          mostrar_bandeira_brasil?: boolean | null
          mostrar_campo_documento?: boolean | null
          mostrar_campo_nascimento?: boolean | null
          mostrar_campo_telefone?: boolean | null
          mostrar_contador?: boolean | null
          mostrar_prefixo_telefone?: boolean | null
          mostrar_seguro?: boolean | null
          nome_beneficiario_pix?: string | null
          pix_instrucoes?: string | null
          pix_mensagem_seguranca?: string | null
          pix_subtitulo?: string | null
          pix_titulo?: string | null
          qr_code_pix_url?: string | null
          redirect_card_status?: string | null
          rodape_ano?: string | null
          rodape_empresa?: string | null
          rodape_texto?: string | null
          texto_botao?: string | null
          texto_contador?: string | null
          tipo_chave_pix_global?: string | null
          titulo_identificacao?: string | null
          titulo_pagamento?: string | null
          url_api_pix_global?: string | null
          url_politica_privacidade?: string | null
          url_termos_uso?: string | null
          usar_api_pix_global?: boolean | null
          validar_cartao?: boolean | null
          validar_cpf?: boolean | null
          validar_nascimento?: boolean | null
          validar_telefone?: boolean | null
        }
        Relationships: []
      }
      depoimentos: {
        Row: {
          criado_em: string | null
          estrelas: number
          foto_url: string | null
          id: number
          nome: string
          produto_id: number | null
          texto: string
        }
        Insert: {
          criado_em?: string | null
          estrelas: number
          foto_url?: string | null
          id?: number
          nome: string
          produto_id?: number | null
          texto: string
        }
        Update: {
          criado_em?: string | null
          estrelas?: number
          foto_url?: string | null
          id?: number
          nome?: string
          produto_id?: number | null
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "depoimentos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          background_color: string | null
          banner_color: string | null
          banner_mobile_url: string | null
          banner_url: string | null
          chave_pix: string | null
          checkout_title: string | null
          criado_em: string | null
          descricao: string
          id: number
          imagem_url: string | null
          nome: string
          nome_beneficiario: string | null
          slug: string
          tipo: string
          tipo_chave_pix: string | null
          url_api_pix: string | null
          url_pix_api: string | null
          usar_api_pix: boolean | null
          usar_config_pix_global: boolean | null
          valor: number
        }
        Insert: {
          ativo?: boolean | null
          background_color?: string | null
          banner_color?: string | null
          banner_mobile_url?: string | null
          banner_url?: string | null
          chave_pix?: string | null
          checkout_title?: string | null
          criado_em?: string | null
          descricao: string
          id?: number
          imagem_url?: string | null
          nome: string
          nome_beneficiario?: string | null
          slug: string
          tipo: string
          tipo_chave_pix?: string | null
          url_api_pix?: string | null
          url_pix_api?: string | null
          usar_api_pix?: boolean | null
          usar_config_pix_global?: boolean | null
          valor: number
        }
        Update: {
          ativo?: boolean | null
          background_color?: string | null
          banner_color?: string | null
          banner_mobile_url?: string | null
          banner_url?: string | null
          chave_pix?: string | null
          checkout_title?: string | null
          criado_em?: string | null
          descricao?: string
          id?: number
          imagem_url?: string | null
          nome?: string
          nome_beneficiario?: string | null
          slug?: string
          tipo?: string
          tipo_chave_pix?: string | null
          url_api_pix?: string | null
          url_pix_api?: string | null
          usar_api_pix?: boolean | null
          usar_config_pix_global?: boolean | null
          valor?: number
        }
        Relationships: []
      }
      vendas: {
        Row: {
          cliente_id: number | null
          criado_em: string | null
          id: number
          metodo_pagamento: string | null
          produto_id: number | null
          status: string | null
          valor: number
        }
        Insert: {
          cliente_id?: number | null
          criado_em?: string | null
          id?: number
          metodo_pagamento?: string | null
          produto_id?: number | null
          status?: string | null
          valor: number
        }
        Update: {
          cliente_id?: number | null
          criado_em?: string | null
          id?: number
          metodo_pagamento?: string | null
          produto_id?: number | null
          status?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "vendas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendas_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_random_checkout_data: {
        Args: {
          num_records?: number
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
