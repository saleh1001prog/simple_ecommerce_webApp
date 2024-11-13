import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product'; // Assuming the model is saved in src/models/Product
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Ensure that params.id is awaited
  const { id } = params; // Not usually necessary, but keep this as a reminder

  // Connect to the database
  await dbConnect();

  try {
    // Use Mongoose to find the product by ID
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

