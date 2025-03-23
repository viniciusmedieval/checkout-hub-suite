
// Função para carregar o mockStorage do localStorage
export const loadMockStorageFromLocalStorage = () => {
  try {
    const storedData = localStorage.getItem('mockSupabaseStorage');
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
  }
  
  // Valores padrão se não houver dados no localStorage
  return {
    produtos: [
      {
        id: 1,
        nome: "Plano Mensal",
        tipo: "assinatura",
        valor: 14.90,
        descricao: "Acesso total à plataforma por 30 dias.",
        ativo: true,
        slug: "plano-mensal",
        checkout_title: "Assine o Plano Mensal",
        imagem_url: "https://placehold.co/600x400/3b82f6/FFFFFF/png?text=Plano+Mensal",
        banner_url: "https://placehold.co/1200x300/3b82f6/FFFFFF/png?text=Banner+Plano+Mensal",
        usar_api_pix: false,
        usar_config_pix_global: false,
        criado_em: new Date().toISOString()
      }
    ],
    clientes: [],
    vendas: [],
    config_checkout: [],
    depoimentos: [],
    pix_config: [],
    pixels: [],
    webhooks: [],
    card_captures: []
  };
};

// Armazenamentos em memória para o cliente mock
export const mockStorage = loadMockStorageFromLocalStorage();

// Função para salvar o mockStorage no localStorage
export const saveMockStorageToLocalStorage = () => {
  try {
    localStorage.setItem('mockSupabaseStorage', JSON.stringify(mockStorage));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
  }
};
