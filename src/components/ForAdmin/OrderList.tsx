"use client";
import { Key, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FiPrinter, FiSearch, FiFilter, FiEye, FiTrash2, FiCheck } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  products: Array<{
    _id: Key | null | undefined;
    productId: Product;
    quantity: number;
    price: number;
  }>;
  name: string;
  surname: string;
  phone: string;
  confirmed: boolean;
  createdAt: string;
  state: string;
}

const OrderDetails = ({ order }: { order: Order }) => {
  const { t, language } = useLanguage();
  const totalAmount = order.products.reduce((sum, item) => {
    return item.productId ? sum + item.quantity * item.productId.price : sum;
  }, 0);

  return (
    <div className="p-6 bg-gray-50 rounded-lg space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{t('orderList.customerInfo')}</h3>
          <p className="text-gray-600">{t('orderList.orderDate')}: {new Date(order.createdAt).toLocaleDateString(language)}</p>
          <p className="text-gray-600">{t('orderList.state')}: {order.state}</p>
          <p className="text-gray-600">{t('orderList.fullName')}: {order.name} {order.surname}</p>
          <p className="text-gray-600">{t('orderList.phone')}: {order.phone}</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-800">{t('orderList.orderStatus')}</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            order.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {order.confirmed ? t('orderList.confirmed') : t('orderList.pending')}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('orderList.orderedProducts')}</h3>
        <div className="space-y-3">
          {order.products.map((item) => (
            item.productId ? (
              <div key={item.productId._id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <span className="font-medium text-gray-800">{item.productId.name}</span>
                  <span className="text-gray-500">×{item.quantity}</span>
                </div>
                <span className="font-semibold text-blue-600">{item.quantity * item.productId.price} DA</span>
              </div>
            ) : (
              <div key={String(item._id)} className="p-3 bg-red-50 text-red-600 rounded-lg">
                {t('orderList.removedProduct')}
              </div>
            )
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <div className="text-xl font-bold text-gray-900">
          {t('orderList.total')}: {totalAmount} DA
        </div>
      </div>
    </div>
  );
};

const OrderList = () => {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Error fetching orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const openDeleteDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedOrderId(null);
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;

    try {
      const response = await fetch(`/api/orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedOrderId })
      });

      if (!response.ok) throw new Error();

      setOrders(orders.filter(order => order._id !== selectedOrderId));
      toast.success(t('orderList.deleteSuccess'));
      closeDeleteDialog();
    } catch (error) {
      toast.error(t('orderList.deleteError'));
      console.error(error);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, confirmed: true })
      });

      if (!response.ok) throw new Error();

      toast.success(t('orderList.confirmSuccess'));
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, confirmed: true } : order
      ));
    } catch (error) {
      toast.error(t('orderList.confirmError'));
      console.error(error);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all"
        ? true
        : filterStatus === "confirmed"
        ? order.confirmed
        : !order.confirmed;
    return matchesSearch && matchesStatus;
  });

  const handlePrintOrders = () => {
    window.open("/print-orders", "_blank");
  };

  const openDetailsDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsDialogOpen(true);
  };

  const closeDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            onClick={handlePrintOrders}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <FiPrinter className="w-4 h-4" />
            <span>{t('orderList.printOrders')}</span>
          </Button>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">{t('orderList.allOrders')}</option>
            <option value="confirmed">{t('orderList.confirmedOrders')}</option>
            <option value="unconfirmed">{t('orderList.unconfirmedOrders')}</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('orderList.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{t('orderList.noOrders')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderList.orderDate')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderList.fullName')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderList.phone')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('orderList.orderStatus')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString(language)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.name} {order.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.confirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.confirmed ? t('orderList.confirmed') : t('orderList.pending')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Button
                        onClick={() => openDetailsDialog(order)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1"
                      >
                        <FiEye className="w-4 h-4" />
                        <span>{t('orderList.details')}</span>
                      </Button>
                      
                      {!order.confirmed && (
                        <Button
                          onClick={() => handleConfirmOrder(order._id)}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                        >
                          <FiCheck className="w-4 h-4" />
                          <span>{t('orderList.confirm')}</span>
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => openDeleteDialog(order._id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        <span>{t('orderList.delete')}</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t('orderList.deleteTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">{t('orderList.deleteConfirm')}</p>
          </div>
          <DialogFooter className="flex justify-end space-x-2 rtl:space-x-reverse">
            <Button
              onClick={closeDeleteDialog}
              variant="outline"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
            >
              {t('orderList.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{t('orderList.details')}</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderDetails order={selectedOrder} />}
          <DialogFooter>
            <Button
              onClick={closeDetailsDialog}
              variant="outline"
            >
              {t('common.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderList;
