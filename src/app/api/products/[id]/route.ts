import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { NextRequest } from 'next/server';
import { Types } from 'mongoose';
import { cache } from 'react';

interface ProductDocument {
  _id: Types.ObjectId;
  name: string;
  price: number;
  description: string;
  images: string[];
  __v: number;
}

// Cache the database connection
const getDbConnection = cache(async () => {
  await dbConnect();
});

// Cache the product fetch
const getProduct = cache(async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    return null;
  }
  return await Product.findById(new Types.ObjectId(id)).lean() as ProductDocument | null;
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;
    
    // Connect to database (cached)
    await getDbConnection();
    
    // Get product (cached)
    const product = await getProduct(id);

    if (!product) {
      return new Response(
        JSON.stringify({ error: 'لم يتم العثور على المنتج' }), 
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
          }
        }
      );
    }

    const sanitizedProduct = {
      ...product,
      _id: product._id.toString(),
    };

    // Add cache headers
    return new Response(
      JSON.stringify(sanitizedProduct),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    return new Response(
      JSON.stringify({ error: 'حدث خطأ أثناء جلب المنتج' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 