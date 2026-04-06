export function convertBRL(amountInCents: number): string {
  const amountInReais = amountInCents / 100;
  return amountInReais.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    
  });
}
