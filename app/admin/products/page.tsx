// app/admin/products/page.tsx - FIXED CLIENT COMPONENT
'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { uploadProductImage } from '@/app/actions/upload';

export default function AdminProducts() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'men',
    stock: 0,
    colors: [''],
    sizes: [''],
  });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
      setSuccessMessage(''); // Clear success when new image is selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    // Mobile: Disable form during submission
    const form = e.target as HTMLFormElement;
    const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Uploading...</span>';
    }

    try {
      // 1. Upload image with mobile optimizations
      if (!mainImage) {
        throw new Error('Please select an image');
      }

      // Mobile: Check image size before upload
      if (mainImage.size > 3 * 1024 * 1024) { // 3MB
        throw new Error(`Image too large (${(mainImage.size / 1024 / 1024).toFixed(1)}MB). Max 3MB. Compress or use a smaller image.`);
      }

      console.log('Upload starting...');
      
      const uploadFormData = new FormData();
      uploadFormData.append('image', mainImage);
      
      const uploadResult = await uploadProductImage(uploadFormData);
      
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      console.log('Upload successful, creating product...');

      // 2. Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        main_image: uploadResult.url!,
        images: [],
        colors: formData.colors.filter(c => c.trim() !== ''),
        sizes: formData.sizes.filter(s => s.trim() !== ''),
        stock: formData.stock,
      };

      // 3. Mobile-friendly fetch with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds
      
      try {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        const result = await response.json();
        
        if (!result.success) {
          // Mobile-friendly error messages
          if (result.error.includes('timeout') || result.error.includes('network')) {
            throw new Error('Connection issue. Please check your internet and try again.');
          }
          throw new Error(result.error || 'Failed to save product');
        }

        // Success! - Show success message instead of alert
        setSuccessMessage('✅ Product added successfully!');
        
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: 0,
          category: 'men',
          stock: 0,
          colors: [''],
          sizes: ['']
        });
        setMainImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
      } catch (fetchError: any) {
        // Handle abort/timeout
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout. Try a smaller image or better connection.');
        }
        throw fetchError;
      }
      
    } catch (error: any) {
      console.error('Submit error:', error);
      
      // Mobile-friendly error display
      const errorMessage = error.message || 'Unknown error';
      
      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setError(`📶 Connection issue: ${errorMessage}. Try with smaller images.`);
      } else if (errorMessage.includes('large')) {
        setError(`📸 ${errorMessage}. Use smaller images on mobile.`);
      } else {
        setError(`❌ ${errorMessage}`);
      }
      
    } finally {
      setIsSubmitting(false);
      
      // Re-enable form
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = '📦 Add Product to Store';
      }
    }
  };

  // Add color input
  const addColorInput = () => {
    setFormData({...formData, colors: [...formData.colors, '']});
    setError(''); // Clear errors when adding new color
  };

  const removeColorInput = (index: number) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({...formData, colors: newColors});
  };

  const updateColor = (index: number, value: string) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({...formData, colors: newColors});
  };

  // Add size input
  const addSizeInput = () => {
    setFormData({...formData, sizes: [...formData.sizes, '']});
    setError(''); // Clear errors when adding new size
  };

  const removeSizeInput = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData({...formData, sizes: newSizes});
  };

  const updateSize = (index: number, value: string) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = value;
    setFormData({...formData, sizes: newSizes});
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-600">Upload products to your store</p>
      </div>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Error: {error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="e.g., Essential Cotton Tee"
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Describe your product..."
            disabled={isSubmitting}
          />
        </div>

        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Main Product Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-64 rounded-lg object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setMainImage(null);
                    setImagePreview('');
                    setError('');
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  title="Remove image"
                  disabled={isSubmitting}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600 mb-1">Click to upload product image</p>
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 3MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
              required
              disabled={isSubmitting}
            />
            <label
              htmlFor="image-upload"
              className={`mt-4 inline-block px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {mainImage ? 'Change Image' : 'Choose Image'}
            </label>
          </div>
        </div>

        {/* Price and Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Price (₦) *
            </label>
            <input
              type="number"
              value={formData.price || ''}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              min="0"
              step="100"
              placeholder="8500"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock || ''}
              onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
              min="0"
              placeholder="50"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            required
            disabled={isSubmitting}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Colors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Colors *
            </label>
            <button
              type="button"
              onClick={addColorInput}
              className={`text-sm ${
                isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'
              }`}
              disabled={isSubmitting}
            >
              + Add color
            </button>
          </div>
          {formData.colors.map((color, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
                placeholder="e.g., Black"
                required={index === 0}
                disabled={isSubmitting}
              />
              {formData.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColorInput(index)}
                  className="px-4 text-red-600 hover:bg-red-50 rounded-lg disabled:text-gray-400"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Sizes *
            </label>
            <button
              type="button"
              onClick={addSizeInput}
              className={`text-sm ${
                isSubmitting ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'
              }`}
              disabled={isSubmitting}
            >
              + Add size
            </button>
          </div>
          {formData.sizes.map((size, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={size}
                onChange={(e) => updateSize(index, e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
                placeholder="e.g., M"
                required={index === 0}
                disabled={isSubmitting}
              />
              {formData.sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSizeInput(index)}
                  className="px-4 text-red-600 hover:bg-red-50 rounded-lg disabled:text-gray-400"
                  disabled={isSubmitting}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Product...
            </span>
          ) : (
            '📦 Add Product to Store'
          )}
        </button>
      </form>
    </div>
  );
}