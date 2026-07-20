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
  subcategories?: GCSubCategory[];
}

export interface GCSubCategory {
  id?: number;
  name?: string;
  image?: string;
  category_id?: number;
  services?: GetGCServicesResponse[];
}

export interface GetGCServicesResponse {
  id?: number;
  service_name?: string;
  image?: string;
  tax_percentage?: number;
  category_id?: number;
  subcategory_id?: number;
}
