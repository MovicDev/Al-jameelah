import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, default: '' },
}, { _id: false });

const customerInfoSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, maxlength: 100 },
  customerPhone: { type: String, required: true, trim: true, maxlength: 30 },
  deliveryCityState: { type: String, required: true, trim: true, maxlength: 150 },
  deliveryAddress: { type: String, default: '', trim: true, maxlength: 300 },
  notes: { type: String, default: '', trim: true, maxlength: 1_000 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  customerInfo: { type: customerInfoSchema, required: true },
  items: { type: [orderItemSchema], validate: [(value) => value.length > 0, 'An order needs at least one item.'] },
  subtotal: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['pending', 'whatsapp_sent', 'contacted', 'confirmed', 'processing', 'completed', 'delivered', 'cancelled'],
    default: 'whatsapp_sent',
    index: true,
  },
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);

