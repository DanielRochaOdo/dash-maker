export interface MonthData {
  month: string;
  records: Record[];
  horasOferecidas: number;
  saldoMesAnterior: number;
  horasUtilizadas: number;
  restante: number;
  totalHorasLancadas: number;
}

export interface Record {
  obs: string;
  ticket: string;
  titulo: string;
  horas: number;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export interface SheetData {
  [month: string]: MonthData;
}