import * as orderService from '../services/orderService.js';
import { serializeOrder } from '../serializers/index.js';
import { sendSuccess } from '../utils/respond.js';

export const create = async (request, response) => {
  const order = await orderService.createOrder(request.validated.body, request.user?.id);
  sendSuccess(response, 201, 'Order created successfully.', { order: serializeOrder(order), data: serializeOrder(order) });
};
export const list = async (request, response) => {
  const result = await orderService.listOrders(request.query);
  sendSuccess(response, 200, 'Orders loaded.', { orders: result.items.map(serializeOrder), data: result.items.map(serializeOrder), pagination: result.pagination });
};
export const mine = async (request, response) => {
  const orders = await orderService.listUserOrders(request.user.id);
  sendSuccess(response, 200, 'Orders loaded.', { orders: orders.map(serializeOrder), data: orders.map(serializeOrder) });
};
export const updateStatus = async (request, response) => {
  const order = await orderService.updateOrderStatus(request.params.id, request.validated.body.status);
  sendSuccess(response, 200, 'Order status updated.', { order: serializeOrder(order), data: serializeOrder(order) });
};

