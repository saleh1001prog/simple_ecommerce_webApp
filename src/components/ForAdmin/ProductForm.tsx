"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { FiUpload, FiX } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from '@/components/ui/ProductImage';

const ProductForm = () => {
  const { t, language } = useLanguage();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);
      const validImages = selectedImages.filter(
        (file) => file.size <= 5 * 1024 * 1024
      );

      if (validImages.length !== selectedImages.length) {
        setError(t('products.imageSizeError'));
        return;
      }

      setImages(validImages);
      const urls = validImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
      setError(null);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newUrls = [...previewUrls];
    newImages.splice(index, 1);
    newUrls.splice(index, 1);
    setImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    images.forEach((file: File) => formData.append("images", file));

    const submitPromise = fetch('/api/products', {
      method: 'POST',
      body: formData,
    });

    toast.promise(submitPromise, {
      loading: t('products.adding'),
      success: () => {
        resetForm();
        return t('products.addSuccess');
      },
      error: t('products.addError')
    });

    try {
      await submitPromise;
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!name.trim()) {
      toast.error(t('products.nameRequired'));
      return false;
    }
    if (!description.trim()) {
      toast.error(t('products.descriptionRequired'));
      return false;
    }
    if (!price || Number(price) <= 0) {
      toast.error(t('products.validPriceRequired'));
      return false;
    }
    if (images.length === 0) {
      toast.error(t('products.imageRequired'));
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setImages([]);
    setPreviewUrls([]);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {t('products.addNew')}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder={t('products.namePlaceholder')}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={6}
              placeholder={t('products.descriptionPlaceholder')}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.priceLabel')}
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder={t('products.pricePlaceholder')}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('products.images')}
            </label>
            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors duration-200">
              <div className="space-y-2 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>{t('products.chooseImages')}</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="sr-only"
                      required={images.length === 0}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  {t('products.imageRequirements')}
                </p>
              </div>
            </div>
          </div>

          {previewUrls.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <ProductImage
                    src={url}
                    alt={`preview ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                <span>{t('common.loading')}</span>
              </div>
            ) : (
              t('products.addButton')
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
