
export interface RawSaleData {
  regiao: string;
  segmento: string;
  cidade: string;
  mediaPedido: number;
  dsc: number;
  dataUltima: string;
  vlrUltima: number;
  profitMargin: number; // Added field for profitability simulation
}

export interface CitySummary {
  cidade: string;
  totalClientes: number;
  ticketMedio: number;
  lucratividadeMedia: number;
  totalVendas: number;
}

export interface SegmentSummary {
  segmento: string;
  count: number;
  totalVendas: number;
}
