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

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  products: Array<{
    _id: Key | null | undefined; productId: Product; quantity: number; price: number 
}>;
  name: string;
  surname: string;
  phone: string;
  confirmed: boolean;
  createdAt: string;
  state : string
}

const OrderDetails = ({ order }: { order: Order }) => {
  const totalAmount = order.products.reduce((sum, item) => {
    // Only add to total if product exists
    return item.productId ? sum + item.quantity * item.productId.price : sum;
  }, 0);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">User Information</h3>
      <p className="text-gray-700">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
      <p className="text-gray-700">Wilaya: {order.state}</p>
      <p className="text-gray-700">Name & Last Name: {order.name} {order.surname}</p>
      <p className="text-gray-700">Phone Number: {order.phone}</p>
      <hr className="my-4 border-gray-300"/>
      
      <div className="mt-4">
        <p className="font-medium text-gray-800 mb-2">Products Ordered</p>
        {order.products.map((item) => (
          item.productId ? (
            <div key={item.productId._id} className="flex justify-between border-b border-gray-300 py-2">
              <span className="text-gray-700">{item.productId.name} - x{item.quantity}</span>
              <span className="text-gray-700">{item.quantity * item.productId.price} da</span>
            </div>
          ) : (
            <div key={item._id} className="flex justify-between border-b border-gray-300 py-2 text-red-600">
              <span className="text-gray-700">This product has been removed from the catalog.</span>
            </div>
          )
        ))}
      </div>
    
      <div className="flex justify-between mt-4 font-semibold text-gray-800">
        <span>Total:</span>
        <span>{totalAmount} Da</span>
      </div>
    </div>
  );
};

const OrderList = () => {
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
      const response = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedOrderId }),
      });
      if (!response.ok) throw new Error("Error deleting order");
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== selectedOrderId)
      );
    } catch (error) {
      console.error(error);
    } finally {
      closeDeleteDialog();
    }
  };

  const handleConfirm = async (orderId: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, confirmed: true }),
      });
      if (!response.ok) throw new Error("Error confirming order");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, confirmed: true } : order
        )
      );
    } catch (error) {
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
    <div className="p-1 bg-gray-50 rounded-lg shadow-lg min-h-[350px] overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={handlePrintOrders}
          className="bg-green-500 text-sm text-white  "
        >
           print orders
        </Button>
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-md text-sm w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
        >
          <option value="all">All Orders</option>
          <option value="confirmed">Confirmed Only</option>
          <option value="unconfirmed">Unconfirmed Only</option>
        </select>
      </div>
      {/* Order List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No order available.</p>
        </div>
      ) : (
        <table className="w-full text-sm bg-white ">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order Date</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-center">
                <td className="py-2 px-4 border-b">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {order.name} {order.surname}
                </td>
                <td className="py-2 px-4 border-b">{order.phone}</td>
                <td className="py-2 px-4 border-b">
                  {order.confirmed ? "Confirmed" : "Unconfirmed"}
                </td>
                <td className="py-2 px-4 border-b flex gap-2 justify-center">
                  <Button
                    onClick={() => openDetailsDialog(order)}
                    className="bg-gray-500 text-white"
                  >
                    details
                  </Button>
                  <Button
                    onClick={() => openDeleteDialog(order._id)}
                    className="bg-red-500 text-white"
                  >
                    Delete
                  </Button>
                  {!order.confirmed && (
                    <Button
                      onClick={() => handleConfirm(order._id)}
                      className="bg-blue-500 text-white "
                    >
                      Confirm
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Confirmation</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this order?</p>
          <DialogFooter className="flex justify-end mt-4">
            <div className="flex w-full justify-between">
              <Button
                onClick={closeDeleteDialog}
                className="bg-gray-200 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-500 "
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Order details dialog */}
      {selectedOrder && (
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle> order details</DialogTitle>
            </DialogHeader>
            <OrderDetails order={selectedOrder} />
            <DialogFooter className="flex justify-end mt-4">
              <Button
                onClick={closeDetailsDialog}
                className="bg-gray-200 text-gray-700 "
              >
                close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrderList;
