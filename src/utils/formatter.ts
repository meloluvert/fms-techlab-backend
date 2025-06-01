// src/utils/formatter.ts
export function formatDate(date?: Date | string | null): string | null {
    if (!date) return null;
  
    let d: Date;
  
    if (typeof date === "string") {
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
   * Exemplo: 4152 -> "41,52"
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
  