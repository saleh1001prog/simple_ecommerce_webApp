"use client";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useState } from "react";

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state) => state.cart.items);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    setIsDialogOpen(false);
    router.push("/checkout");
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="relative text-gray-700 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={() => setIsDialogOpen(true)}
          >
            <FiShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </button>
        </DialogTrigger>
        <DialogContent className="min-w-fit">
          <DialogTitle className="text-xl font-bold mb-4">Shopping Cart</DialogTitle>
          <table className="w-fit bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr>
                <th className="px-2 md:px-4 py-2 border-b">Product</th>
                <th className="px-2 md:px-4 py-2 border-b">Quantity</th>
                <th className="px-2 md:px-4 py-2 border-b">Price (DA)</th>
                <th className="px-2 md:px-4 py-2 border-b">Total (DA)</th>
                <th className="px-2 md:px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.productId}>
                  <td className="px-2 md:px-4 py-2 border-b">
                    <div className="flex flex-col items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                      <span className="mt-2 text-center">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-2 md:px-4 py-2 border-b">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(item.productId, Number(e.target.value))
                      }
                      className="w-16 p-1 border rounded text-center"
                    />
                  </td>
                  <td className="px-2 md:px-4 py-2 border-b">{item.price}</td>
                  <td className="px-2 md:px-4 py-2 border-b">
                    {item.price * item.quantity}
                  </td>
                  <td className="px-2 md:px-4 py-2 border-b">
                    <button
                      onClick={() => handleRemoveFromCart(item.productId)}
                      className="text-red-500"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right mt-4 font-semibold">
            Total Amount: {totalAmount} DA
          </div>
          <button
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
            className={`${
              cartItems.length === 0 ? "bg-gray-300" : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded mt-4 w-full`}
          >
            املئ معلوماتك
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
