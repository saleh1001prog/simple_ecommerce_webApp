"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Image from "next/image";
import { Button } from "./ui/button";
import { FiMinus, FiPlus, FiShoppingCart, FiLoader, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from "./ui/ProductImage";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface Props {
  productId: string;
}



const ProductDetailsPage = ({ productId }: Props) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const { t, language } = useLanguage();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "فشل في تحميل المنتج");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.images[0],
        })
      );
      toast.success(t('cart.updateSuccess'));
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <FiLoader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">{t('common.error')}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square mb-4">
            <ProductImage
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="rounded-lg"
              priority
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <ProductImage
                    src={image}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    fill
                    className="rounded-md object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-4 text-xl font-semibold text-blue-600">
              {product.price} da
            </p>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-700 font-medium">{t('productDetails.quantity')}:</span>
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <FiPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200"
              disabled={adding}
            >
              {adding ? (
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <FiLoader className="animate-spin" />
                  <span>{t('productDetails.addToCart')}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                  <FiShoppingCart className="h-5 w-5" />
                  <span>{t('productDetails.addToCart')}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
