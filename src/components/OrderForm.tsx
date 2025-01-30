"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/contexts/LanguageContext';
import { wilayas } from "@/data/wilayas";
import toast from "react-hot-toast";

const OrderForm = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    state: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cart = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.phone || !formData.state) {
      toast.error(t('orderForm.required'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          products: cart.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      if (!response.ok) throw new Error();

      toast.success(t('orderForm.success'));
      dispatch(clearCart());
      setFormData({ name: "", surname: "", phone: "", state: "" });
    } catch (error) {
      toast.error(t('orderForm.error'));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('orderForm.name')}
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('orderForm.surname')}
          </label>
          <Input
            type="text"
            value={formData.surname}
            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('orderForm.phone')}
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('orderForm.state')}
          </label>
          <Select
            value={formData.state}
            onValueChange={(value) => setFormData({ ...formData, state: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une wilaya" />
            </SelectTrigger>
            <SelectContent>
              {wilayas.map((wilaya) => (
                <SelectItem key={wilaya.id} value={wilaya.name}>
                  {wilaya.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isSubmitting ? t('common.loading') : t('orderForm.submit')}
      </Button>
    </form>
  );
};

export default OrderForm;
