"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import OrderForm from "@/components/OrderForm";
import { useLanguage } from '@/contexts/LanguageContext';
import { FiShoppingBag } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const router = useRouter();
  const cartItems = useSelector((state: any) => state.cart.items);
  const { t, language } = useLanguage();
  const totalAmount = cartItems.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/");
    }
  }, [cartItems.length, router]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <FiShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">{t('cart.emptyCart')}</h2>
        <Button
          onClick={() => router.push('/')}
          className="mt-4"
        >
          {t('products.title')}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {t('orderForm.title')}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('cart.title')}
              </h3>
              <div className="space-y-3">
                {cartItems.map((item: any) => (
                  <div key={item.productId} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 mx-2">×</span>
                      <span className="text-gray-600">{item.quantity}</span>
                    </div>
                    <span className="font-semibold">{item.price * item.quantity} DA</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{t('cart.total')}:</span>
                    <span>{totalAmount.toFixed(2)} DA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div>
              <OrderForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
