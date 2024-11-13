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
  const dispatch = useDispatch();

  const fetchProduct = useCallback(async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/products/product/${id}`);
      if (!response.ok) throw new Error("Product not found");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
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
          image: product.images[0],
        })
      );
    }
  };

  if (isLoading) {
    return <div className="text-center">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="container p-6 justify-center mx-auto">
      <div className="w-full lg:flex gap-4 justify-between items-center mx-auto">
        <div className="w-full lg:w-[1000px]">
          <div className="flex space-x-2 mb-4 justify-center">
          import Image from "next/image";

// تعديل داخل دالة render
{product.images.map((image, index) => (
  <Image
    key={index}
    src={image}
    alt={`Thumbnail ${index + 1}`}
    width={64} // العرض المطلوب للصورة المصغرة
    height={64} // الارتفاع المطلوب للصورة المصغرة
    className={`w-16 h-16 object-cover rounded cursor-pointer ${
      index === currentImageIndex ? "border-2 border-blue-500" : "border"
    }`}
    onClick={() => handleThumbnailClick(index)}
  />
))}

<div className="flex justify-center items-center bg-gray-200 overflow-hidden rounded-lg md:h-[500px] p-5">
  <Image
    src={product.images[currentImageIndex]}
    alt={`Image ${currentImageIndex + 1} of ${product.name}`}
    width={500} // العرض المطلوب للصورة الكبيرة
    height={500} // الارتفاع المطلوب للصورة الكبيرة
    className="object-contain h-full w-full"
  />
</div>

        </div>
        <div className="w-full flex flex-col mt-6 lg:mt-0 gap-y-2 ">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-700 ">{product.description}</p>
          <p className="text-gray-900 font-semibold ">${product.price.toFixed(2)}</p>
          <div className="w-full flex justify-end items-center">
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              طلب المنتج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
