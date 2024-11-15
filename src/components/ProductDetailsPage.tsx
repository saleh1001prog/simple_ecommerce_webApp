"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { useParams } from "next/navigation";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch(`/api/products/product/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product details.");
      const data = await response.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.images[0],
        })
      );
      alert("تمت إضافة المنتج إلى السلة!");
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">جاري تحميل تفاصيل المنتج...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center p-10">لم يتم العثور على المنتج.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* قسم الصور */}
        <div className="flex-1">
          <div className="flex space-x-2 mb-4 justify-center">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`border rounded cursor-pointer ${
                  index === currentImageIndex ? "border-blue-500" : "border-gray-300"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={64}
                  height={64}
                  className="object-cover rounded"
                />
              </div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg overflow-hidden flex justify-center items-center">
            <Image
              src={product.images[currentImageIndex]}
              alt={`Image of ${product.name}`}
              width={800}
              height={600}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex-1 flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-lg font-semibold text-blue-700">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            طلب المنتج
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
