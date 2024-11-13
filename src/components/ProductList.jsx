"use client";
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { useRouter } from "next/navigation";
import { Skeleton } from './ui/skeleton';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products/FilterProduct?search=${searchQuery}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]); // Re-run fetch when search query changes

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    }));
  };

  return (
    <div className="flex flex-col items-center p-5">
      <input
        type="text"
        placeholder="ابحث عن المنتج"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border rounded w-80 text-right"
      />
      <div className="flex flex-wrap gap-2 justify-center">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-[300px] border rounded-lg p-4 shadow-md">
              <Skeleton className="w-full h-[200px] rounded-t-lg" />
              <div className="mt-4 flex flex-col gap-y-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))
        ) : products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="w-[300px] border rounded-lg p-4 shadow-md">
              <div className="w-full h-[200px]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-t-lg"
                />
              </div>
              <div className="mt-4 flex flex-col gap-y-1">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => router.push(`/productDetails/${product._id}`)}
                    className="flex items-center bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
                    aria-label={`View details of ${product.name}`}
                  >
                    التفاصيل
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center bg-blue-500 gap-x-2 text-white px-3 py-2 rounded hover:bg-blue-600"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    طلب المنتج
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">لا توجد منتجات حالياً</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
