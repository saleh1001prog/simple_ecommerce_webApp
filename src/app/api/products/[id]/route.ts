import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: {
    id: string;
  };
};

interface ProductDocument {
  _id: any;
  name: string;
  price: number;
  description: string;
  images: string[];
  __v: number;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  if (!params?.id) {
    return NextResponse.json(
      { error: 'معرف المنتج مطلوب' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const product = await Product.findById(params.id).lean() as ProductDocument;

    if (!product) {
      return NextResponse.json(
        { error: 'لم يتم العثور على المنتج' },
        { status: 404 }
      );
    }

    // Transform the product data to handle ObjectId
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