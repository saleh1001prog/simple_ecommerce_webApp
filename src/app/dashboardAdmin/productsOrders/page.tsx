import OrderList from "@/components/ForAdmin/OrderList";

//my-app\src\app\dashboardAdmin\productsOrders\page.tsx
export default function page() {
    return (
      <div>
        <h1 className="text-2xl font-bold">
          
        <OrderList/>
        </h1>
        {/* Content for managing product orders goes here */}
      </div>
    );
  }
  