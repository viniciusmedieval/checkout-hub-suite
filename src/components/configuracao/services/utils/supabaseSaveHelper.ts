
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Utilitário para salvar dados no Supabase seguindo o padrão correto
 * que inclui o .select() e verificação de retorno de dados
 */
export const salvarDadosSupabase = async <T>(
  tabela: string,
  dados: any,
  idField: string = 'id'
): Promise<T | null> => {
  try {
    const client = await getSupabaseClient();
    
    if (!client) {
      console.error('❌ Cliente Supabase não inicializado');
      throw new Error('Cliente Supabase não inicializado');
    }
    
    // Verifica se é criação ou atualização
    const isUpdate = dados[idField] !== undefined;
    
    let result;
    
    if (isUpdate) {
      console.log(`🔄 Atualizando registro em ${tabela} com ${idField}=${dados[idField]}`);
      
      const { data, error } = await client
        .from(tabela)
        .update(dados)
        .eq(idField, dados[idField])
        .select('*'); // IMPORTANTE: Garantir que o select seja chamado após o update
      
      if (error) {
        console.error(`❌ Erro ao atualizar dados em ${tabela}:`, error);
        throw error;
      }
      
      result = data;
      console.log(`✅ Registro atualizado com sucesso em ${tabela}:`, result);
      console.log("Resultado do Supabase:", data);
    } else {
      console.log(`🔄 Inserindo novo registro em ${tabela}`);
      
      const { data, error } = await client
        .from(tabela)
        .insert(dados)
        .select('*'); // IMPORTANTE: Garantir que o select seja chamado após o insert
      
      if (error) {
        console.error(`❌ Erro ao inserir dados em ${tabela}:`, error);
        throw error;
      }
      
      result = data;
      console.log(`✅ Registro inserido com sucesso em ${tabela}:`, result);
      console.log("Resultado do Supabase:", data);
    }
    
    if (!result || result.length === 0) {
      console.error(`❌ Erro: Nenhum dado retornado do Supabase após operação em ${tabela}`);
      return null;
    }
    
    return result[0] as T;
  } catch (error: any) {
    console.error(`❌ Erro ao salvar dados em ${tabela}:`, error);
    console.error('Detalhes do erro:', error.message || 'Erro desconhecido', error.stack || 'Sem stack trace');
    return null;
  }
};

/**
 * Versão para operações upsert (inserir ou atualizar)
 */
export const upsertDadosSupabase = async <T>(
  tabela: string,
  dados: any,
  onConflict: string = 'id'  // Corrigido: agora aceita apenas string
): Promise<T | null> => {
  try {
    const client = await getSupabaseClient();
    
    if (!client) {
      console.error('❌ Cliente Supabase não inicializado');
      throw new Error('Cliente Supabase não inicializado');
    }
    
    console.log(`🔄 Realizando upsert em ${tabela}`);
    console.log(`🔄 Usando onConflict='${onConflict}'`);
    
    // Corrigido: onConflict agora é apenas string, passada como opção no método upsert
    const { data, error } = await client
      .from(tabela)
      .upsert(dados, { onConflict: onConflict })
      .select('*');
    
    if (error) {
      console.error(`❌ Erro ao fazer upsert em ${tabela}:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.error(`❌ Erro: Nenhum dado retornado do Supabase após upsert em ${tabela}`);
      return null;
    }
    
    console.log(`✅ Upsert realizado com sucesso em ${tabela}:`, data);
    console.log("Resultado do Supabase:", data);
    return data[0] as T;
  } catch (error: any) {
    console.error(`❌ Erro ao fazer upsert em ${tabela}:`, error);
    console.error('Detalhes do erro:', error.message || 'Erro desconhecido', error.stack || 'Sem stack trace');
    return null;
  }
};
