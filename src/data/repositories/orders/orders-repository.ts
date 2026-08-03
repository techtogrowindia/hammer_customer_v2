import type { GetPlaceOrderResponse } from '@/domain/models/orders/place-order-response';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';
import { PlaceOrderRequest } from '@/data/requests/orders/orders-request-builder';
import { IOrdersRepository } from '@/domain/repositories/orders/IOrdersRepository';

export const OrdersRepository: IOrdersRepository = {
  placeOrder: async (request: PlaceOrderRequest): Promise<GetPlaceOrderResponse> => {
    const formData = new FormData();

    formData.append('service_id', request.service_id);
    formData.append('issue_description', request.issue_description);
    formData.append('type', request.type);
    formData.append('scheduled_at', request.scheduled_at);
    formData.append('address_id', request.address_id);

    request.images?.forEach((image: any) => {
      formData.append('images[]', {
        uri: image.uri,
        name: image.name,
        type: image.type,
      } as any);
    });

    request.videos?.forEach((video: any) => {
      formData.append('videos[]', {
        uri: video.uri,
        name: video.name,
        type: video.type,
      } as any);
    });

    request.voice_notes?.forEach((audio: any) => {
      formData.append('voice_notes[]', {
        uri: audio.uri,
        name: audio.name,
        type: audio.type,
      } as any);
    });

    const response = await apiClient.post(apiEndpoints.placeOrder, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  listOrders: async (): Promise<GetPlaceOrderResponse> => {
    const response = await apiClient.get(apiEndpoints.listOrders);

    return response.data;
  },

  getOrder: async (orderId: number): Promise<GetPlaceOrderResponse> => {
    const response = await apiClient.get(`${apiEndpoints.listOrders}?id=${orderId}`);

    return response.data;
  },

  /**
   * The order screen used to accept a quote by changing local state and
   * nothing else, so the choice never left the phone. `technician_id` is what
   * the endpoint matches on.
   */
  confirmQuote: async (orderId: number, technicianId: number) => {
    const response = await apiClient.post(apiEndpoints.confirmQuote, {
      order_id: orderId,
      technician_id: technicianId,
    });

    return response.data;
  },

  answerAdditionalQuote: async (quoteId: number, accept: boolean) => {
    const response = await apiClient.post(apiEndpoints.confirmAdditionalQuote, {
      quote_id: quoteId,
      action: accept ? 'approve' : 'reject',
    });

    return response.data;
  },

  cancelOrder: async (orderId: number, reason: string) => {
    const response = await apiClient.post(apiEndpoints.cancelOrder, {
      order_id: orderId,
      reason,
    });

    return response.data;
  },
};
