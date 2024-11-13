import Image from "next/image";
import React from "react";
import { FaFacebook, FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";

// Define metadata for SEO
export const metadata = {
  title: "About Us",
  description: "تعرف على صاحب متجرنا الإلكتروني الذي يسعى لتقديم أفضل المنتجات بأسعار منافسة وعروض متجددة لضمان رضا العملاء.",
  keywords: ["صاحب المتجر الإلكتروني", "منتجات عالية الجودة", "عروض يومية", "رضا العملاء"]
};

function Page() {
  return (
    <div className="flex min-h-[calc(100vh_-_187px)] flex-wrap items-center justify-around bg-gray-100 p-4">
      <div>
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          تعرف على صاحب متجرنا الإلكتروني
        </h1>
        <p className="text-lg text-gray-700 text-center max-w-md mb-8">
          نحن نعمل جاهدين لتقديم أفضل المنتجات ذات الفعالية العالية وبأسعار منافسة، مع عروض يومية متجددة لضمان رضا عملائنا الأعزاء.
        </p>

        {/* Social Media Icons */}
        <div className="container mb-8 mx-auto flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-500"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.tiktok.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:text-black"
          >
            <FaTiktok size={24} />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://www.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-green-700"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>
      </div>
      <div>
        <Image
          src="/aboutUsImage.webp"
          alt="صورة لصاحب المتجر الإلكتروني، يقدم منتجات بجودة عالية وعروض تنافسية"
          width={400}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

export default Page;
