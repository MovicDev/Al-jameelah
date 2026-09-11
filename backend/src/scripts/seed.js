import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { env, validateEnvironment } from '../config/env.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Service } from '../models/Service.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { ensureDefaultAdmin } from '../services/adminBootstrapService.js';

const categories = [
  ['Hair Oils', 'hair-oils'], ['Hair Creams', 'hair-creams'], ['Hair Care', 'hair-care'], ['Natural Hair', 'natural-hair'],
].map(([name, slug]) => ({ name, slug, active: true }));

const product = {
  name: 'Tressence Hair Growth Oil', slug: 'tressence-hair-growth-oil', category: 'hair-oils',
  price: 8500, discountPrice: 7500, stock: 45, stockStatus: 'in_stock', status: 'available', featured: true,
  size: '100ml', description: 'A nutrient-dense Al-jameelah oil formulated to strengthen strands and support healthy hair routines.',
  shortDescription: 'Al-jameelah oil for stronger, moisturized natural hair.', benefits: ['Supports length retention', 'Nourishes a dry scalp'],
  ingredients: ['Argan oil', 'Castor oil', 'Rosemary oil'], howToUse: 'Massage a small amount into the scalp.',
  hairTypes: ['4A', '4B', '4C'], rating: 4.9, reviewCount: 0, sku: 'AJW-OIL-100', images: [],
};

const service = {
  name: 'Natural Hair Regimen Consultation', slug: 'natural-hair-regimen-consultation', price: 15000,
  duration: '45 Minutes', description: 'A personalized consultation covering hair goals, current routine, and a practical care plan.',
  benefits: ['Hair and scalp review', 'Personalized routine'], available: true,
  deliverable: 'Video call and digital regimen', popular: true,
};

const settings = {
  key: 'primary', brandName: 'Al-jameelah World', tagline: 'Healthy Hair. Natural Beauty. Confidence.',
  whatsappNumber: '+234 708 380 7419', phoneDisplay: '0708 380 7419', email: 'aljameelahworld@gmail.com',
  shippingNotice: 'Nationwide delivery is available.', announcementBar: 'Pure Al-jameelah hair care.', currencySymbol: '₦', currencyCode: 'NGN',
};

const seed = async () => {
  validateEnvironment();
  await connectDatabase(env.mongodbUri);
  await Promise.all(categories.map((item) => Category.updateOne({ slug: item.slug }, { $setOnInsert: item }, { upsert: true })));
  await Product.updateOne({ slug: product.slug }, { $setOnInsert: product }, { upsert: true });
  await Service.updateOne({ slug: service.slug }, { $setOnInsert: service }, { upsert: true });
  await StoreSettings.updateOne({ key: 'primary' }, { $setOnInsert: settings }, { upsert: true });

  const admin = await ensureDefaultAdmin();
  console.info(`${admin.created ? 'Created' : 'Found'} administrator account for ${admin.email}.`);
  console.info('Development seed completed. Existing records were preserved.');
};

seed().catch((error) => {
  console.error('Seed failed:', error.message);
  process.exitCode = 1;
}).finally(() => disconnectDatabase());
