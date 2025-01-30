//my-app\src\app\productDetails\[id]\page.tsx
import ProductDetailsWrapper from "./ProductDetailsWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'تفاصيل المنتج',
  description: 'عرض تفاصيل المنتج الكاملة',
};

export default async function Page() {
  return <ProductDetailsWrapper />;
}
