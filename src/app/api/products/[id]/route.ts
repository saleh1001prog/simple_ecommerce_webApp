import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest } from 'next/server';

interface ProductDocument {
  _id: any;
  name: string;
  price: number;
  description: string;
  images: string[];
  __v: number;
}

type Props = {
  params: {
    id: Promise<string> | string;
  };
};

export async function GET(
  _request: NextRequest,
  { params }: Props
) {
  try {
    const id = typeof params.id === 'string' ? params.id : await params.id;
    await dbConnect();
    
    const product = await Product.findById(id).lean() as ProductDocument;

    if (!product) {
      return Response.json(
        { error: 'لم يتم العثور على المنتج' },
        { status: 404 }
      );
    }

    const sanitizedProduct = {
      ...product,
      _id: product._id.toString(),
    };

    return Response.json(sanitizedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json(
      { error: 'حدث خطأ أثناء جلب المنتج' },
      { status: 500 }
    );
  }
} 