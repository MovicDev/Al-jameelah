import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Product, ProductCategory, Service, StockStatus } from '../../types';
import { ImageUploader } from './ImageUploader';
import { getDiscountPriceError } from '../../api/productPayload';

type ProductForm = Omit<Product, 'id'>;
type ServiceForm = Omit<Service, 'id'>;

interface ProductEditorProps {
  open: boolean;
  editing: boolean;
  value: ProductForm;
  onChange: (value: ProductForm) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

interface ListEditorProps {
  label: string;
  helperText: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}

const ListEditor: React.FC<ListEditorProps> = ({ label, helperText, placeholder, values, onChange }) => {
  const [draft, setDraft] = useState('');

  const addValue = () => {
    const nextValue = draft.trim();
    if (!nextValue || values.includes(nextValue)) return;
    onChange([...values, nextValue]);
    setDraft('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <label className="block font-bold text-[#2D1B22]">{label}</label>
          <p className="mt-0.5 text-[11px] leading-relaxed text-[#8C7A82]">{helperText}</p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#8C7A82] ring-1 ring-[#E8DCE2]">
          {values.length} added
        </span>
      </div>
      <div className="min-h-12 rounded-xl border border-[#E8DCE2] bg-white p-2.5">
        <div className="flex flex-wrap gap-2">
          {values.map((item) => (
            <span key={item} className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#F2C0D4] bg-[#FDF2F7] py-1 pl-2.5 pr-1.5 text-[11px] font-medium text-[#4A2536]">
              <span className="truncate">{item}</span>
              <button
                type="button"
                onClick={() => onChange(values.filter((value) => value !== item))}
                className="rounded-full p-0.5 text-[#A76882] transition-colors hover:bg-white hover:text-rose-600"
                aria-label={`Remove ${item}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className={`${values.length ? 'mt-2.5 border-t border-[#F5ECF0] pt-2.5' : ''} flex min-w-0 gap-2`}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addValue();
              }
            }}
            placeholder={placeholder}
            className="min-w-0 flex-1 rounded-lg bg-[#FAF7F5] px-3 py-2 text-xs text-[#2D1B22] outline-none ring-1 ring-inset ring-[#EFE5EB] placeholder:text-[#A9979F] focus:ring-2 focus:ring-[#E84A7F]/40"
          />
          <button
            type="button"
            onClick={addValue}
            disabled={!draft.trim()}
            className="inline-flex flex-shrink-0 items-center gap-1 rounded-lg bg-[#2D1B22] px-3 py-2 text-[11px] font-bold text-white transition-colors hover:bg-[#E84A7F] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductEditorModal: React.FC<ProductEditorProps> = ({ open, editing, value, onChange, onClose, onSubmit }) => {
  if (!open) return null;
  const discountPriceError = getDiscountPriceError(value.price, value.discountPrice);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#F0E6EA] space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0E6EA] pb-4">
          <h3 className="font-serif-display font-bold text-xl text-[#2D1B22]">{editing ? 'Edit Product' : 'Add New Al-jameelah Product'}</h3>
          <button onClick={onClose} className="p-1 text-[#8C7A82] hover:text-[#2D1B22]"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 text-xs text-[#4A3E42]">
          <div>
            <label className="block font-bold mb-1">Product Title *</label>
            <input type="text" required value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="e.g. Tressence Hair Growth Oil" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold mb-1">Category</label>
              <select value={value.category} onChange={(event) => onChange({ ...value, category: event.target.value as ProductCategory })} className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]">
                <option value="hair-oils">Hair Oils & Tonics</option><option value="hair-creams">Whipped Butters & Creams</option><option value="hair-care">Protein Masks & Washes</option><option value="natural-hair">4A–4C Styling Essentials</option>
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">Price (₦) *</label>
              <input type="number" required min="0" value={value.price} onChange={(event) => onChange({ ...value, price: Number(event.target.value) })} className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" />
            </div>
            <div>
              <label className="block font-bold mb-1">Discount Price (₦)</label>
              <input type="number" min="0" max={value.price} aria-invalid={Boolean(discountPriceError)} value={value.discountPrice ?? ''} onChange={(event) => onChange({ ...value, discountPrice: event.target.value ? Number(event.target.value) : undefined })} placeholder="Optional sale price" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" />
              {discountPriceError && <p className="mt-1 text-[11px] font-medium text-rose-600">{discountPriceError}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-bold mb-1">Size / Volume</label><input type="text" value={value.size} onChange={(event) => onChange({ ...value, size: event.target.value })} placeholder="100ml or 250g" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
            <div><label className="block font-bold mb-1">Stock Status</label><select value={value.stockStatus} onChange={(event) => onChange({ ...value, stockStatus: event.target.value as StockStatus })} className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]"><option value="in_stock">In Stock</option><option value="out_of_stock">Out of Stock</option><option value="low_stock">Low Stock</option></select></div>
          </div>
          <div><label className="block font-bold mb-1">Short Description</label><input type="text" required value={value.shortDescription} onChange={(event) => onChange({ ...value, shortDescription: event.target.value })} placeholder="One sentence summary for product cards" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
          <div><label className="block font-bold mb-1">Detailed Description</label><textarea rows={3} required value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} placeholder="Full formulation narrative" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
          <div className="space-y-4 rounded-2xl border border-[#F0E6EA] bg-[#FAF7F5] p-4 sm:p-5">
            <div>
              <h4 className="font-serif-display text-sm font-bold text-[#2D1B22]">Customer product guidance</h4>
              <p className="mt-0.5 text-[11px] text-[#8C7A82]">These details appear in the product information tabs customers see.</p>
            </div>
            <ListEditor
              label="Key Benefits"
              helperText="Add one clear product benefit at a time."
              placeholder="e.g. Helps reduce breakage"
              values={value.benefits}
              onChange={(benefits) => onChange({ ...value, benefits })}
            />
            <div>
              <label className="block font-bold text-[#2D1B22]">How to Use</label>
              <p className="mb-2 mt-0.5 text-[11px] leading-relaxed text-[#8C7A82]">Explain the application method, amount, and frequency.</p>
              <textarea
                rows={3}
                value={value.howToUse}
                onChange={(event) => onChange({ ...value, howToUse: event.target.value })}
                placeholder="e.g. Apply a small amount to damp hair twice weekly and massage gently."
                className="w-full resize-y rounded-xl border border-[#E8DCE2] bg-white px-3 py-2.5 text-xs leading-relaxed text-[#2D1B22] outline-none focus:ring-2 focus:ring-[#E84A7F]/30"
              />
            </div>
            <ListEditor
              label="Suitable Hair Types"
              helperText="List each hair type or protective style this product suits."
              placeholder="e.g. 4C hair or Locs"
              values={value.hairTypes}
              onChange={(hairTypes) => onChange({ ...value, hairTypes })}
            />
          </div>
          <ImageUploader images={value.images} onChange={(images) => onChange({ ...value, images })} maxImages={4} label="Product Photos & Gallery" helperText="Upload photos directly from your phone/computer (Gallery/Camera) or paste an image URL" />
          <div className="pt-4 border-t border-[#F0E6EA] flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 border border-[#E8DCE2] rounded-full text-xs font-semibold hover:bg-[#FAF7F5]">Cancel</button><button type="submit" className="px-6 py-2.5 bg-[#E84A7F] text-white rounded-full text-xs font-bold hover:bg-[#D42A63]">Save Product</button></div>
        </form>
      </div>
    </div>
  );
};

interface ServiceEditorProps {
  open: boolean;
  editing: boolean;
  value: ServiceForm;
  onChange: (value: ServiceForm) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const ServiceEditorModal: React.FC<ServiceEditorProps> = ({ open, editing, value, onChange, onClose, onSubmit }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#F0E6EA] space-y-6">
        <div className="flex items-center justify-between border-b border-[#F0E6EA] pb-4"><h3 className="font-serif-display font-bold text-xl text-[#2D1B22]">{editing ? 'Edit Service' : 'Add Hair Service'}</h3><button onClick={onClose} className="p-1 text-[#8C7A82] hover:text-[#2D1B22]"><X className="w-5 h-5" /></button></div>
        <form onSubmit={onSubmit} className="space-y-4 text-xs text-[#4A3E42]">
          <div><label className="block font-bold mb-1">Service Name *</label><input type="text" required value={value.name} onChange={(event) => onChange({ ...value, name: event.target.value })} placeholder="e.g. 1-on-1 Virtual Hair Growth Consultation" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-bold mb-1">Price (₦) *</label><input type="number" required min="0" value={value.price} onChange={(event) => onChange({ ...value, price: Number(event.target.value) })} className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
            <div><label className="block font-bold mb-1">Duration</label><input type="text" required value={value.duration} onChange={(event) => onChange({ ...value, duration: event.target.value })} placeholder="e.g. 45 mins" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
          </div>
          <div><label className="block font-bold mb-1">Deliverable Format</label><input type="text" required value={value.deliverable} onChange={(event) => onChange({ ...value, deliverable: event.target.value })} placeholder="WhatsApp Video Call + 90-Day Regimen PDF" className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
          <div><label className="block font-bold mb-1">Description</label><textarea rows={3} required value={value.description} onChange={(event) => onChange({ ...value, description: event.target.value })} className="w-full bg-[#FAF7F5] border border-[#E8DCE2] rounded-xl px-3 py-2 text-xs text-[#2D1B22]" /></div>
          <ImageUploader images={value.image ? [value.image] : []} onChange={(images) => onChange({ ...value, image: images[0] || '' })} maxImages={1} kind="service" label="Service Banner Image" helperText="Upload a photo for this service from your device or use a link" />
          <div className="pt-4 border-t border-[#F0E6EA] flex justify-end gap-3"><button type="button" onClick={onClose} className="px-5 py-2.5 border border-[#E8DCE2] rounded-full text-xs font-semibold hover:bg-[#FAF7F5]">Cancel</button><button type="submit" className="px-6 py-2.5 bg-[#E84A7F] text-white rounded-full text-xs font-bold hover:bg-[#D42A63]">Save Service</button></div>
        </form>
      </div>
    </div>
  );
};
