import { Address } from '../address/get-address-reponse';

export interface GetPlaceOrderResponse {
  success?: boolean;
  message?: string;
  data?: GPDData;
}

export interface GPDData {
  order_id?: number;
  order_number?: string;
  status?: string;
  service?: Service;
  issue_description?: string;
  type?: string;
  scheduled_at?: Date;
  address?: Address;
  images?: string[];
  videos?: any[];
  voice_notes?: string[];
  assigned_technicians_count?: number;
  quotes_submitted_count?: number;
  technician_quotes?: TechnicianQuote[];
  amount_rupees?: null;
  tax_amount_rupees?: null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Service {
  id?: number;
  service_name?: string;
}

export interface TechnicianQuote {
  technician_id?: number;
  technician_name?: string;
  technician_unique_id?: string;
  quote_submitted?: boolean;
  amount?: null;
  quoted_at?: null;
}
