import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'معرف المنتج مطلوب' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const id = await Promise.resolve(params.id);
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { error: 'لم يتم العثور على المنتج' },
        { status: 404 }
      );
    }

    // Transform the product data to handle ObjectId and ensure valid JSON
    const sanitizedProduct = {
      ...product,
      _id: product._id.toString(),
    };

    return NextResponse.json(sanitizedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المنتج' },
      { status: 500 }
    );
  }
} 