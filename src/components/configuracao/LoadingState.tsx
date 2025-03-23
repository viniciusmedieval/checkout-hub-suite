
export function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Configuração do Checkout</h1>
      </div>
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-full"></div>
        <div className="h-96 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}
