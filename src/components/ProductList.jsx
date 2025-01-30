"use client";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { FiShoppingCart, FiLoader, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from '@/components/ui/ProductImage';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { t, language } = useLanguage();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(t('productList.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.images[0],
      })
    );
    toast.success(t('cart.updateSuccess'));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FiLoader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span>{t('productList.loading')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 min-h-[60vh] flex items-center justify-center">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-600 min-h-[60vh] flex items-center justify-center">
        {t('productList.noProducts')}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        {t('productList.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/productDetails/${product._id}`}>
              <div className="relative h-48 w-full">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              <p className="text-blue-600 font-bold mb-4">
                {t('productList.price')}: {product.price} DA
              </p>
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button
                  onClick={() => handleAddToCart(product)}
                  className="flex-1"
                >
                  <FiShoppingCart className="mr-2 rtl:ml-2" />
                  {t('productList.addToCart')}
                </Button>
                <Link href={`/productDetails/${product._id}`}>
                  <Button variant="outline">
                    {t('productList.details')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
