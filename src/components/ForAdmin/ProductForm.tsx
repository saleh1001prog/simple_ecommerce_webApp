"use client";
import { useState } from 'react';
import axios, { AxiosError } from 'axios';

const ProductForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const validImages = selectedImages.filter(file => file.size <= 5 * 1024 * 1024); // 5MB limit
      if (validImages.length !== selectedImages.length) {
        alert('Some images are too large (max 5MB).');
      }
      setImages(validImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    images.forEach((file: File) => formData.append('images', file));
  
    try {
      const response = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        alert('Product created successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setImages([]);
      }
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      alert(`Error creating product: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Add Product</h2>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        required
        className="w-full p-3 border h-[250px] border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows={4}
      ></textarea>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="block text-gray-700">
        <span className="text-sm font-medium">Product Images</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          required
          className="block w-full mt-2 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20">
              <img
                src={URL.createObjectURL(image)}
                alt={`preview ${index}`}
                className="w-full h-full object-cover rounded-lg shadow-sm border border-gray-200"
              />
            </div>
          ))}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full text-white font-semibold py-2 rounded-md transition duration-150 ease-in-out ${
          isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Add Product'}
      </button>
    </form>
  );
};

export default ProductForm;
