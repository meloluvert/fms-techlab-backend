// src/utils/formatter.ts
export function formatDate(date?: Date | string | null): string | null {
    if (!date) return null;
  
    let d: Date;
  
    if (typeof date === "string") {
      // Tenta criar um objeto Date válido a partir da string
      const replaced = date.replace(" ", "T");
      d = new Date(replaced);
  
      // Verifica se a data é válida
      if (isNaN(d.getTime())) {
        console.warn("Data inválida recebida em formatDate:", date);
        return null;
      }
    } else {
      d = date;
    }
    
    // Subtrai 3 horas (em milissegundos) para ajustar o fuso horário
    d.setTime(d.getTime() - 3 * 60 * 60 * 1000);
  
    // Formata a data no fuso horário de São Paulo
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  
    return formatter.format(d);
  }
  
  
  
  /**
   * Recebe valor em centavos (integer) e retorna string formatada em reais
   * Exemplo: 4152 -> "R$ 41,52"
   */


  export function formatMoney(valueInCents: number | string): string {
    const value =
      typeof valueInCents === "string"
        ? parseInt(valueInCents, 10)
        : valueInCents;
    const formatter = new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value / 100);
  }
  