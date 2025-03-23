
export type ChartData = {
  name: string;
  valor: number;
  quantidade?: number;
};

export type DashboardStats = {
  totalClientes: number;
  produtosAtivos: number;
  totalVendas: number;
  taxaConversao: number;
  loading: boolean;
};

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};
