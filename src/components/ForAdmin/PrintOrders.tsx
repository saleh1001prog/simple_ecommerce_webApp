"use client";
import { useEffect, useState } from "react";
import { FiPrinter, FiFilter, FiLoader } from "react-icons/fi";
import { Button } from "../ui/button";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  products: Array<{ productId: Product | null; quantity: number }>;
  name: string;
  surname: string;
  phone: string;
  state: string;
  confirmed: boolean;
  createdAt: string;
}

const OrderCard = ({ order }: { order: Order }) => {
  const totalAmount = order.products.reduce((sum, item) => 
    item.productId ? sum + item.quantity * item.productId.price : sum, 0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 print:border print:shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات العميل</h3>
          <div className="space-y-2 text-gray-600">
            <p><span className="font-medium">الاسم:</span> {order.name} {order.surname}</p>
            <p><span className="font-medium">الهاتف:</span> {order.phone}</p>
            <p><span className="font-medium">الولاية:</span> {order.state}</p>
            <p><span className="font-medium">التاريخ:</span> {new Date(order.createdAt).toLocaleDateString('ar')}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">حالة الطلب</h3>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            order.confirmed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.confirmed ? 'مؤكد' : 'في انتظار التأكيد'}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">المنتجات المطلوبة</h3>
        <div className="space-y-3">
          {order.products.map((item, index) => (
            item.productId ? (
              <div 
                key={item.productId._id}
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="text-gray-800">{item.productId.name}</span>
                  <span className="text-gray-500">×{item.quantity}</span>
                </div>
                <span className="font-medium text-gray-900">
                  {item.quantity * item.productId.price} دج
                </span>
              </div>
            ) : (
              <div 
                key={index}
                className="text-red-600 bg-red-50 p-3 rounded-md"
              >
                تم إزالة هذا المنتج من الكتالوج
              </div>
            )
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <div className="text-xl font-bold text-gray-900">
            المجموع الكلي: {totalAmount} دج
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError(null);
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("فشل في جلب الطلبات");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return filterStatus === "confirmed" ? order.confirmed : !order.confirmed;
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <FiLoader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="headWhenPrint flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <Button
            onClick={handlePrint}
            className="flex items-center space-x-2 rtl:space-x-reverse bg-green-600 hover:bg-green-700"
          >
            <FiPrinter className="w-5 h-5" />
            <span>طباعة جميع الطلبات</span>
          </Button>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <FiFilter className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">جميع الطلبات</option>
              <option value="confirmed">الطلبات المؤكدة</option>
              <option value="unconfirmed">الطلبات غير المؤكدة</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد طلبات متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintOrders;
