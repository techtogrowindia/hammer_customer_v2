import { Address } from '../address/get-address-reponse';

export interface GetPlaceOrderResponse {
  success?: boolean;
  message?: string;
  data?: GPDDatas;
}

export type GPDDatas = {
  orders?: GPDOrders;
} & GPDData;

export type GPDOrders = GPDData[];

export interface GPDData {
  order_id?: number;
  order_number?: string;
  status?: string;
  can_cancel?: boolean;
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
  rejections_count?: number;
  technician_quotes?: TechnicianQuote[];
  technician_rejections?: any[];
  confirmed_technician?: null;
  additional_quotes?: any[];
  invoice?: Invoice;
  status_log?: StatusLog[];
  amount_rupees?: null;
  tax_amount_rupees?: null;
  created_at?: Date;
  updated_at?: Date;
}

export interface Invoice {
  initial_quote?: InitialQuote;
  additional_quotes?: any[];
  additional_quotes_total?: number;
  total_amount_rupees?: null;
}

export interface InitialQuote {
  desc?: string;
  amount?: null;
}

export interface Service {
  id?: number;
  service_name?: string;
}

export interface StatusLog {
  event?: string;
  status?: string;
  previous_status?: null;
  title?: string;
  message?: string;
  actor_type?: string;
  metadata?: any[];
  occurred_at?: Date;
}

export interface TechnicianQuote {
  technician_id?: number;
  technician_name?: string;
  technician_unique_id?: string;
  quote_submitted?: boolean;
  amount?: null;
  quoted_at?: null;
}
