
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Carregando configurações..." }: LoadingStateProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Configuração do Checkout</h1>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-pulse space-y-6 w-full">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="h-96 bg-gray-200 rounded w-full"></div>
        </div>
        {message && (
          <p className="text-gray-500 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}
