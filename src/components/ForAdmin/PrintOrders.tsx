"use client";
import { useEffect, useState } from "react";

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

const PrintOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

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

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "all") return true;
    return filterStatus === "confirmed" ? order.confirmed : !order.confirmed;
  });

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <div className="headWhenPrint flex justify-between items-center mb-6">
        <button
          onClick={handlePrint}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition duration-150 ease-in-out"
        >
          Print All Orders
        </button>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-5 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
        >
          <option value="all">All Orders</option>
          <option value="confirmed">Confirmed Orders Only</option>
          <option value="unconfirmed">Unconfirmed Orders Only</option>
        </select>
      </div>

      {/* Order Cards */}
      <div className="flex flex-wrap gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="p-6 h-fit bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-4">
              {order.name} {order.surname}
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Phone Number:</strong> {order.phone}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>State:</strong> {order.state}
            </p>

            <div className="space-y-2">
              {order.products.map((item, index) => (
                item.productId ? (
                  <div
                    key={item.productId._id}
                    className="flex justify-between items-center border-b border-gray-200 py-2"
                  >
                    <span className="mr-10">
                      {item.productId.name} - Quantity: {item.quantity}
                    </span>
                    <span>{item.quantity * item.productId.price} DZD</span>
                  </div>
                ) : (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b border-gray-200 py-2 text-red-600"
                  >
                    <span className="mr-10">This product has been removed from the catalog.</span>
                  </div>
                )
              ))}
            </div>

            <div className="flex justify-between mt-4 font-semibold text-gray-800">
              <span>Total Amount:</span>
              <span>
                {order.products.reduce(
                  (sum, item) =>
                    item.productId ? sum + item.quantity * item.productId.price : sum,
                  0
                )}{" "}
                DZD
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrintOrders;
