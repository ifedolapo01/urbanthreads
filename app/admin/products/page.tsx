// app/admin/products/page.tsx - MINIMAL WORKING VERSION
'use client';

import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
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
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    
    if (!mainImage) {
      setError('Please select an image');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Upload image
      const uploadFormData = new FormData();
      uploadFormData.append('image', mainImage);
      const uploadResult = await uploadProductImage(uploadFormData);
      
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

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

      // 3. API call
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save product');
      }

      // 4. Success - set success flag
      setSuccess(true);
      
      // 5. Reset form (but keep success state)
      // Don't reset the form immediately - let user see success
      
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form function (called when user wants to add another product)
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'men',
      stock: 0,
      colors: [''],
      sizes: [''],
    });
    setMainImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSuccess(false);
    setError('');
  };

  // Add color input
  const addColorInput = () => {
    setFormData({...formData, colors: [...formData.colors, '']});
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

  // If success, show success screen
  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Product Added Successfully!</h2>
          <p className="text-gray-600 mb-8">Your product has been added to the store.</p>
          <div className="space-y-4">
            <button
              onClick={resetForm}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Add Another Product
            </button>
            <a
              href="/admin/dashboard"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-600">Upload products to your store</p>
      </div>
      
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
                <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
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
              className={`mt-4 inline-block px-6 py-3 rounded-lg font-medium ${
                isSubmitting 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
              } transition-colors`}
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
                isSubmitting ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'
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
                isSubmitting ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'
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
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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