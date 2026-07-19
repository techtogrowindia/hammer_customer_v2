export interface GetAddressResponse {
  success?: boolean;
  message?: string;
  data?: Data & Address;
}

export interface Data {
  addresses?: Address[];
}

export interface Address {
  id?: number;
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  pincode?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  created_at?: Date;
  updated_at?: Date;
}
