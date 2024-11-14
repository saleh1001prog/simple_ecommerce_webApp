// my-app\src\app\api\products\route.ts

import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';

// POST method to create a new product
export async function POST(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const images = formData.getAll('images') as File[];

  // Upload images to Cloudinary and store URLs in MongoDB
  const uploadedImages = [];
  for (const file of images) {
    const buffer = await file.arrayBuffer();
    const base64String = `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`;
    const uploadResponse = await cloudinary.uploader.upload(base64String, { folder: 'products' });
    uploadedImages.push(uploadResponse.secure_url);
  }

  const product = new Product({
    name,
    description,
    price,
    images: uploadedImages,
  });

  await product.save();

  return NextResponse.json({ message: 'Product created successfully', product });
}

// GET method to fetch all products
export async function GET() {
  await connectDB();

  try {
    const products = await Product.find();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching products', error: (error as Error).message },
      { status: 500 }
    );
  }
}



// PUT method to update a product by ID
export async function PUT(req: NextRequest) {
  await connectDB();

  const formData = await req.formData();
  const _id = formData.get('_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const existingImages = formData.getAll('existingImages') as string[];
  const newImages = formData.getAll('newImages') as File[];

  if (!_id) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    const existingProduct = await Product.findById(_id);
    if (!existingProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Find images that need to be deleted from Cloudinary
    const imagesToDelete = existingProduct.images.filter(
      (imageUrl: string) => !existingImages.includes(imageUrl)
    );

    // Delete unused images from Cloudinary
    for (const imageUrl of imagesToDelete) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0]; // Extract the public ID
      if (publicId) {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    // Upload new images to Cloudinary
    const uploadedNewImages = [];
    for (const file of newImages) {
      const buffer = await file.arrayBuffer();
      const base64String = `data:${file.type};base64,${Buffer.from(buffer).toString('base64')}`;
      const uploadResponse = await cloudinary.uploader.upload(base64String, { folder: 'products' });
      uploadedNewImages.push(uploadResponse.secure_url);
    }

    // Update the product in MongoDB
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        name,
        description,
        price,
        images: [...existingImages, ...uploadedNewImages],
      },
      { new: true }
    );

    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating product', error: error.message }, { status: 500 });
  }
}

// DELETE method to remove a product by ID
export async function DELETE(req: NextRequest) {
  await connectDB();

  try {
    const { _id } = await req.json(); // Extract `_id` from the request body
    if (!_id) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    // Find the product to get its images before deletion
    const productToDelete = await Product.findById(_id);
    if (!productToDelete) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Delete images from Cloudinary
    for (const imageUrl of productToDelete.images) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0]; // Extract the public ID
      if (publicId) {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    // Delete the product from MongoDB
    await Product.findByIdAndDelete(_id);

    return NextResponse.json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting product', error: error.message }, { status: 500 });
  }
}