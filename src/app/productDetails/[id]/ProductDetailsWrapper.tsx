"use client";
import { useParams } from "next/navigation";
import ProductDetailsPage from "@/components/ProductDetailsPage";

const ProductDetailsWrapper = () => {
  const params = useParams();
  const productId = params.id as string;

  if (!productId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">معرف المنتج غير صالح</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto">
        <ProductDetailsPage productId={productId} />
      </div>
    </div>
  );
};

export default ProductDetailsWrapper; 