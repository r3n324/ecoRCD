export interface Constructora {
  nombre_empresa?: string;
  nombre?: string;
  telefono?: string;
  contacto_responsable?: string;
}

export interface Lote {
  id?: string | number;
  tipo_material: string;
  volumen_m3: number | string;
  zona?: string;
  direccion?: string;
  estado?: string;
  constructoras?: Constructora | Constructora[] | null;
  constructora?: Constructora | null;
}

export interface LotesResponse {
  success: boolean;
  data: Lote[] | null;
  error: string | null;
}
