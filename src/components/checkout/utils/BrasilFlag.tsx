
import React from "react";

export function BrasilFlag({ size = 16, className = "" }: { size?: number; className?: string }) {
  // Proporção padrão da bandeira brasileira (10:7)
  const width = size * 1.43;
  const height = size;

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 120 84" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Fundo verde */}
      <rect width="120" height="84" fill="#009C3B" />
      
      {/* Losango amarelo */}
      <path d="M60 8L112 42L60 76L8 42L60 8Z" fill="#FFDF00" />
      
      {/* Círculo azul */}
      <circle cx="60" cy="42" r="20" fill="#002776" />
      
      {/* Faixa branca (simplificada) */}
      <path d="M60 52C65.5228 52 70 47.5228 70 42C70 36.4772 65.5228 32 60 32C54.4772 32 50 36.4772 50 42C50 47.5228 54.4772 52 60 52Z" fill="#FFFFFF" />
    </svg>
  );
}
