"use client";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../store/cartSlice";
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import ProductImage from '@/components/ui/ProductImage';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

interface RootState {
  cart: {
    items: CartItem[];
  };
}

// مكون الصف الخاص بالعربة
const CartItemRow = React.memo(({ item, onQuantityChange, onRemove }: CartItemRowProps) => (
  <tr className="transition-all hover:bg-gray-50">
    <td className="px-2 md:px-4 py-3 border-b">
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <ProductImage
            src={item.imageUrl}
            alt={item.name}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <span className="mt-2 text-center text-sm font-medium">{item.name}</span>
      </div>
    </td>
    <td className="px-2 md:px-4 py-3 border-b">
      <input
        type="number"
        value={item.quantity}
        min="1"
        onChange={(e) => onQuantityChange(item.productId, Number(e.target.value))}
        className="w-20 p-2 border rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </td>
    <td className="px-2 md:px-4 py-3 border-b font-medium">{item.price} DA</td>
    <td className="px-2 md:px-4 py-3 border-b font-bold text-blue-600">
      {item.price * item.quantity} DA
    </td>
    <td className="px-2 md:px-4 py-3 border-b">
      <button 
        onClick={() => onRemove(item.productId)} 
        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
      >
        حذف
      </button>
    </td>
  </tr>
));

CartItemRow.displayName = 'CartItemRow';

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { t, language } = useLanguage();

  // دالة إزالة المنتج
  const handleRemoveFromCart = useCallback(
    (productId) => {
      dispatch(removeFromCart(productId));
      toast.success(t('cart.deleteSuccess'));
    },
    [dispatch, t]
  );

  // دالة تغيير الكمية
  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      if (newQuantity < 1) {
        handleRemoveFromCart(productId);
        return;
      }
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
      toast.success(t('cart.updateSuccess'));
    },
    [dispatch, handleRemoveFromCart, t]
  );

  // دالة الانتقال لصفحة الدفع
  const handleCheckout = useCallback(() => {
    setIsDialogOpen(false);
    router.push("/checkout");
  }, [router]);

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success(t('cart.clearSuccess'));
  };

  // حساب المبلغ الإجمالي باستخدام useMemo
  const totalAmount = useMemo(
    () =>
      cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartItems]
  );

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="relative text-gray-700 p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => setIsDialogOpen(true)}
          >
            <FiShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                {cartItems.length}
              </span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-fit max-w-4xl max-h-[80vh] overflow-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <DialogTitle className="text-2xl font-bold mb-6 text-gray-800">
            {t('cart.title')}
          </DialogTitle>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleClearCart}
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              {t('cart.clearCart')}
            </Button>
          </div>
          {cartItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th>{t('cart.product')}</th>
                      <th>{t('cart.quantity')}</th>
                      <th>{t('cart.price')}</th>
                      <th>{t('cart.total')}</th>
                      <th>{t('cart.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <CartItemRow
                        key={item.productId}
                        item={item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemoveFromCart}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 space-y-4">
                <div className="text-right text-xl font-bold text-gray-800">
                  {t('cart.total')}: {totalAmount} DA
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-lg font-medium"
                >
                  {t('cart.checkout')}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">{t('cart.emptyCart')}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
