import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  await dbConnect();

  try {
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Error fetching product' }, { status: 500 });
  }
}
