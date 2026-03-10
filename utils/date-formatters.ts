import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { DEFAULT_TIMEZONE } from "@/lib/consts";

/**
 * Recebe uma data (como string ISO ou objeto Date)
 * e retorna apenas a hora formatada no fuso local (ex: "11:30")
 */
export function formatarHoraLocal(data: string | Date): string {
  // Se vier vazio, nulo ou undefined, retorna string vazia pra não quebrar a tela
  if (!data) return "";

  try {
    // Verifica se é uma string. Se for, converte. Se já for Date, usa direto.
    const dataObj = typeof data === "string" ? parseISO(data) : data;

    // O format do date-fns cuida de jogar pro fuso do celular do usuário
    return formatInTimeZone(dataObj, DEFAULT_TIMEZONE, "HH:mm");
  } catch (error) {
    console.error("Erro ao formatar a data:", error);
    return "Hora inválida";
  }
}

/**
 * Recebe uma string ISO e retorna a data no formato DD/MM/AAAA
 */
export function formatarDataLocal(data: string | Date): string {
  if (!data) return "";

  try {
    const dataObj = typeof data === "string" ? parseISO(data) : data;

    return formatInTimeZone(dataObj, DEFAULT_TIMEZONE, "dd/MM/yyyy");
  } catch (error) {
    console.error("Erro ao formatar a data:", error);
    return "Data inválida";
  }
}

/**
 * Recebe uma string ISO e retorna a data e hora no formato "DD/MM/AAAA às HH:mm"
 */
export function formatarDataHoraLocal(data: string | Date): string {
  if (!data) return "";

  const dataObj = typeof data === "string" ? parseISO(data) : data;

  return formatInTimeZone(dataObj, DEFAULT_TIMEZONE, "dd/MM/yyyy 'às' HH:mm"); // Retorna "10/03/2026 às 11:30"
}
