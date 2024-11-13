import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  await connectDB();

  const { items, name, surname, phone, state } = await req.json();

  // تحقق من المنتجات والكميات داخل الطلب
  const productDetails = await Promise.all(
    items.map(async (item: { productId: string; quantity: number }) => {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product with ID ${item.productId} not found`);
      return {
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      };
    })
  );

  // إنشاء طلب جديد باستخدام تفاصيل المنتجات
  const order = new Order({
    products: productDetails,
    name,
    surname,
    phone,
    state,
    confirmed: false,
  });

  await order.save();
  return NextResponse.json({ message: 'Order placed successfully', order });
}

export async function PUT(req: NextRequest) {
  await connectDB();

  const { id, confirmed } = await req.json();

  try {
    // تحديث حالة التأكيد للطلب بناءً على معرف الطلب
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    order.confirmed = confirmed;
    await order.save();

    return NextResponse.json({ message: 'Order confirmed successfully', order });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error confirming order' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { id } = await req.json();
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ message: 'Failed to delete order', error }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  const search = req.nextUrl.searchParams.get('search') || '';
  const showUnconfirmedOnly = req.nextUrl.searchParams.get('showUnconfirmedOnly') === 'true';

  const filter: any = {};
  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ name: regex }, { phone: regex }];
  }

  if (showUnconfirmedOnly) {
    filter.confirmed = false;
  }

  try {
    const orders = await Order.find(filter).populate('products.productId', 'name price'); // عرض اسم وسعر المنتج
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch orders', error }, { status: 500 });
  }
}
