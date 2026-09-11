import React, { useState, useRef } from 'react';
import { uploadProductImage, uploadServiceImage } from '../../auth/services/mediaService';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Link as LinkIcon, 
  Plus, 
  Check, 
  Sparkles,
  Camera,
  Star
} from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
  kind?: 'product' | 'service';
}

const PRESET_HAIR_IMAGES = [
  {
    name: 'Growth Oil Bottle',
    url: 'https://images.unsplash.com/photo-1608248597359-5407d57c79e6?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Whipped Hair Butter',
    url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Scalp Tonic Dropper',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Raw Al-jameelah Mask',
    url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'African Shea Cream',
    url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Natural 4C Crown',
    url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 4,
  label = 'Product Images',
  helperText = 'Upload from your device (phone gallery / PC) or enter a web link',
  kind = 'product',
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle files selected from file dialog or drop
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || isUploading) return;
    setErrorMsg('');

    const newImages = [...images];
    const filesToProcess = Array.from(files).slice(0, Math.max(0, maxImages - images.length));
    setIsUploading(true);

    for (const file of filesToProcess) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrorMsg('Please upload valid image files (JPG, PNG, WEBP).');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size is too large (max 5MB per image).');
        continue;
      }
      try {
        const upload = kind === 'service' ? uploadServiceImage : uploadProductImage;
        newImages.push(await upload(file));
        onChange([...newImages]);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Image upload failed.');
      }
    }
    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (images.length >= maxImages) {
      setErrorMsg(`Maximum ${maxImages} images allowed.`);
      return;
    }
    onChange([...images, urlInput.trim()]);
    setUrlInput('');
    setErrorMsg('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    const reordered = [...images];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      {/* Label and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block font-bold text-xs text-[#2D1B22]">
            {label} <span className="text-[#E84A7F]">*</span>
          </label>
          {helperText && (
            <p className="text-[11px] text-[#8C7A82]">{helperText}</p>
          )}
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF7F5] p-1 rounded-xl border border-[#EFE5EB] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              activeMode === 'upload'
                ? 'bg-white text-[#E84A7F] shadow-xs'
                : 'text-[#6B5861] hover:text-[#2D1B22]'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Device Upload</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              activeMode === 'url'
                ? 'bg-white text-[#E84A7F] shadow-xs'
                : 'text-[#6B5861] hover:text-[#2D1B22]'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Web URL</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all ${
              activeMode === 'presets'
                ? 'bg-white text-[#C89D42] shadow-xs'
                : 'text-[#6B5861] hover:text-[#2D1B22]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={isUploading}
        onChange={(e) => void handleFiles(e.target.files)}
        className="hidden"
      />

      {/* 1. Device Drag & Drop / Click Zone */}
      {activeMode === 'upload' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(event) => void handleDrop(event)}
          onClick={() => { if (!isUploading) fileInputRef.current?.click(); }}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#E84A7F] bg-[#FDF2F7]'
              : 'border-[#E2D4DC] bg-[#FAF7F5] hover:border-[#E84A7F] hover:bg-[#FFFDFE]'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#EFE5EB] shadow-xs flex items-center justify-center text-[#E84A7F]">
              {isUploading ? <Upload className="w-6 h-6 animate-pulse" /> : <Camera className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs font-bold text-[#2D1B22]">
                {isUploading ? 'Uploading securely to Cloudinary…' : 'Click to browse photo from phone or computer'}
              </p>
              <p className="text-[11px] text-[#8C7A82] mt-0.5">
                or drag and drop your product image file here (PNG, JPG, WEBP)
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-1.5 rounded-full bg-white border border-[#E8DCE2] text-xs font-semibold text-[#4A3E42] shadow-xs hover:text-[#E84A7F] hover:border-[#E84A7F] transition-colors"
            >
              Select Image File
            </button>
          </div>
        </div>
      )}

      {/* 2. Web URL Input Zone */}
      {activeMode === 'url' && (
        <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#EFE5EB] space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste direct image link (e.g. https://.../image.jpg)"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-white border border-[#E8DCE2] rounded-xl text-xs text-[#2D1B22] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30"
            />
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-4 py-2 bg-[#E84A7F] hover:bg-[#D42A63] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Add Link
            </button>
          </div>
        </div>
      )}

      {/* 3. Preset Library Zone */}
      {activeMode === 'presets' && (
        <div className="bg-[#FAF7F5] p-4 rounded-2xl border border-[#EFE5EB] space-y-3">
          <p className="text-[11px] text-[#6B5861] font-medium">
            Select standard Al-jameelah aesthetic imagery for quick catalog setup:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PRESET_HAIR_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (images.length >= maxImages) {
                    setErrorMsg(`Maximum ${maxImages} images allowed.`);
                    return;
                  }
                  onChange([...images, preset.url]);
                }}
                className="group relative aspect-square rounded-xl overflow-hidden border border-[#E2D4DC] hover:border-[#E84A7F] transition-all"
                title={preset.name}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Images Gallery Preview */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-[#6B5861] font-medium">
            <span>Uploaded Images ({images.length}/{maxImages}):</span>
            <span className="text-[10px] text-[#8C7A82]">First image is the Main Cover photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((imgSrc, index) => (
              <div
                key={index}
                className={`relative group rounded-2xl overflow-hidden border-2 bg-white aspect-square shadow-xs transition-all ${
                  index === 0 ? 'border-[#E84A7F] ring-2 ring-[#E84A7F]/20' : 'border-[#EFE5EB]'
                }`}
              >
                <img
                  src={imgSrc}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Cover Badge */}
                {index === 0 ? (
                  <span className="absolute top-2 left-2 bg-[#E84A7F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-2.5 h-2.5 fill-current" /> Cover Photo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimaryImage(index)}
                    className="absolute top-2 left-2 bg-black/60 hover:bg-[#E84A7F] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Set as Main Cover Photo"
                  >
                    Set as Cover
                  </button>
                )}

                {/* Remove Image Button */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                  title="Remove Image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Quick Add More Tile if under limit */}
            {images.length < maxImages && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E2D4DC] hover:border-[#E84A7F] rounded-2xl aspect-square flex flex-col items-center justify-center text-[#8C7A82] hover:text-[#E84A7F] bg-[#FAF7F5] hover:bg-[#FFFDFE] transition-all cursor-pointer"
              >
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-semibold">+ Add Photo</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
