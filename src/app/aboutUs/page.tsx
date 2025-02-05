"use client"
import Image from "next/image";
import React from "react";
import { FaFacebook, FaTiktok, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { useLanguage } from '@/contexts/LanguageContext';

// Define metadata for SEO


function Page() {
  const { t, language } = useLanguage();

  const socialLinks = [
    {
      icon: <FaFacebook size={24} />,
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/",
      label: "Facebook",
      hoverColor: "hover:text-blue-500"
    },
    {
      icon: <FaTiktok size={24} />,
      href: process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/",
      label: "TikTok",
      hoverColor: "hover:text-black"
    },
    {
      icon: <FaInstagram size={24} />,
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/",
      label: "Instagram",
      hoverColor: "hover:text-pink-500"
    },
    {
      icon: <FaWhatsapp size={24} />,
      href: process.env.NEXT_PUBLIC_WHATSAPP_URL || "https://www.whatsapp.com/",
      label: "WhatsApp",
      hoverColor: "hover:text-green-700"
    }
  ];

  return (
    <div 
      className="flex min-h-[100vh] flex-wrap items-center justify-around bg-gray-100 p-4 md:p-8" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="max-w-xl text-center md:text-right mb-8 md:mb-0">
        <h1 className="text-4xl font-bold text-blue-900 mb-6">
          {t('aboutUs.title')}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          {t('aboutUs.description')}
        </p>

        {/* Social Media Icons */}
        <div className="flex justify-center md:justify-start space-x-6 rtl:space-x-reverse">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className={`transition-colors duration-200 ${social.hoverColor}`}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25"></div>
        <div className="relative">
          <Image
            src="/aboutUsImage.webp"
            alt={t('aboutUs.imageAlt')}
            width={400}
            height={400}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
