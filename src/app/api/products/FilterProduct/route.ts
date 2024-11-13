// src/app/api/products/FilterProduct/route.ts
import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product"; // Adjust the path to your Product model
import dbConnect from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  try {
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    const products = await Product.find(query);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
  }
}
