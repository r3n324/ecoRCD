export interface Constructora {
  id?: number | string;
  user_id?: string;
  nombre_empresa?: string;
  nombre?: string;
  nit?: string;
  tipo_perfil?: string;
  contacto_responsable?: string;
  telefono?: string;
  email_corporativo?: string;
  direccion_oficina?: string;
  verificado?: boolean;
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

export interface Usuario {
  id: string;
  email?: string;
  rol: 'admin' | 'usuario_normal' | 'constructora' | string;
  constructora_id?: number;
}

export interface AuthResponse {
  success: boolean;
  usuario: Usuario | null;
  error: string | null;
}
