import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    
    // التحقق من وجود البيانات المطلوبة
    if (!body.name || !body.surname || !body.phone || !body.state || !body.products) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // إنشاء طلب جديد
    const order = new Order({
      name: body.name,
      surname: body.surname,
      phone: body.phone,
      state: body.state,
      products: body.products,
      confirmed: false,
      createdAt: new Date()
    });

    await order.save();

    return NextResponse.json({ 
      message: 'تم إنشاء الطلب بنجاح',
      order 
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الطلب' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { id, confirmed } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { confirmed },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الطلب' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'تم تحديث الطلب بنجاح',
      order 
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث الطلب' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'معرف الطلب مطلوب' },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الطلب' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'تم حذف الطلب بنجاح' 
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء حذف الطلب' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const search = req.nextUrl.searchParams.get('search') || '';
  const showUnconfirmedOnly = req.nextUrl.searchParams.get('showUnconfirmedOnly') === 'true';

  // تعريف نوع `filter` كـ Record<string, unknown> بدلًا من any
  const filter: Record<string, unknown> = {};
  
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