export interface PlaceOrderRequest {
  service_id: string;
  issue_description: string;
  type: 'scheduled' | 'immediate';
  scheduled_at: string;
  address_id: string;

  images?: {
    uri: string;
    name: string;
    type: string;
  }[];

  videos?: {
    uri: string;
    name: string;
    type: string;
  }[];

  voice_notes?: {
    uri: string;
    name: string;
    type: string;
  }[];
}
