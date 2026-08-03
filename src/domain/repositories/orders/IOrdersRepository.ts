import { PlaceOrderRequest } from '@/data/requests/orders/orders-request-builder';
import type { GetPlaceOrderResponse } from '@/domain/models/orders/place-order-response';

export interface IOrdersRepository {
  placeOrder: (request: PlaceOrderRequest) => Promise<GetPlaceOrderResponse>;
  listOrders: () => Promise<GetPlaceOrderResponse>;
  /** Fetches one order, with its quotes, extras and status trail. */
  getOrder: (orderId: number) => Promise<GetPlaceOrderResponse>;
  /** Accepts one technician's price. The rest expire. */
  confirmQuote: (orderId: number, technicianId: number) => Promise<{ success: boolean; message: string }>;
  /** Answers a mid-job charge. */
  answerAdditionalQuote: (quoteId: number, accept: boolean) => Promise<{ success: boolean; message: string }>;
  cancelOrder: (orderId: number, reason: string) => Promise<{ success: boolean; message: string }>;
}
