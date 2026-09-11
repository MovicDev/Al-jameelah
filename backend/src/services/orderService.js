import crypto from 'node:crypto';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/AppError.js';

const makeOrderNumber = () => `AJW-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

export const createOrder = async ({ customerInfo, items }, userId) => {
  const ids = [...new Set(items.map((item) => item.productId))];
  const products = await Product.find({ _id: { $in: ids }, status: 'available' });
  const byId = new Map(products.map((product) => [product.id, product]));
  const resolvedItems = items.map((item) => {
    const product = byId.get(item.productId);
    if (!product) throw new AppError(422, 'product_unavailable', 'One or more selected products are unavailable.');
    if (item.quantity > product.stock) throw new AppError(422, 'insufficient_stock', `Only ${product.stock} unit(s) of ${product.name} are available.`);
    const price = product.discountPrice ?? product.price;
    return {
      product: product._id,
      productId: product.id,
      productName: product.name,
      size: item.size,
      quantity: item.quantity,
      price,
      image: product.images[0]?.url ?? '',
    };
  });
  const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Order.create({
    orderNumber: makeOrderNumber(),
    user: userId ?? null,
    customerInfo,
    items: resolvedItems,
    subtotal,
    totalAmount: subtotal,
    status: 'whatsapp_sent',
  });
};

export const listOrders = ({ page = 1, limit = 50, status } = {}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 50));
  const filter = status ? { status } : {};
  return Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Order.countDocuments(filter),
  ]).then(([items, total]) => ({ items, pagination: { page: safePage, limit: safeLimit, total, pages: Math.ceil(total / safeLimit) } }));
};

export const listUserOrders = (userId) => Order.find({ user: userId }).sort({ createdAt: -1 });

export const updateOrderStatus = async (id, status) => {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!order) throw new AppError(404, 'order_not_found', 'Order not found.');
  return order;
};

