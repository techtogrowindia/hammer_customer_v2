import type { AddAddressRequest } from '@/data/requests/address/address-request-builder';
import { GetAddressResponse } from '@/domain/models/address/get-address-reponse';

export interface IAddressRepository {
  addAddress: (request: AddAddressRequest) => Promise<GetAddressResponse>;
  editAddress: (request: AddAddressRequest) => Promise<GetAddressResponse>;
  getAddress: () => Promise<GetAddressResponse>;
  deleteAddress: (addressID: string) => Promise<GetAddressResponse>;
}
