import { PlaceOrderRequest } from '@/data/requests/orders/orders-request-builder';
import type { GetPlaceOrderResponse } from '@/domain/models/orders/place-order-response';

export interface IOrdersRepository {
  placeOrder: (request: PlaceOrderRequest) => Promise<GetPlaceOrderResponse>;
  listOrders: () => Promise<GetPlaceOrderResponse>;
}
