export interface GetCategoriesResponse {
  success?: boolean;
  message?: string;
  data?: GCData;
}

export interface GCData {
  pincode?: string;
  categories?: GCCategory[];
}

export interface GCCategory {
  id?: number;
  name?: string;
  image?: string;
}
