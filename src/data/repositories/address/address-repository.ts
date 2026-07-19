import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';
import { AddAddressRequest } from '@/data/requests/address/address-request-builder';
import { GetAddressResponse } from '@/domain/models/address/get-address-reponse';
import { IAddressRepository } from '@/domain/repositories/address/IAddressRepository';

export const AddressRepository: IAddressRepository = {
  addAddress: async (request: AddAddressRequest): Promise<GetAddressResponse> => {
    const response = await apiClient.post(apiEndpoints.address, request);
    return response.data;
  },
  editAddress: async (request: AddAddressRequest): Promise<GetAddressResponse> => {
    const response = await apiClient.put(`${apiEndpoints.address}/${request.id}`, request);
    return response.data;
  },
  getAddress: async (): Promise<GetAddressResponse> => {
    const response = await apiClient.get(apiEndpoints.address);
    return response.data;
  },
  deleteAddress: async (addressID: string): Promise<GetAddressResponse> => {
    const response = await apiClient.delete(`${apiEndpoints.address}/${addressID}`);
    return response.data;
  },
};
