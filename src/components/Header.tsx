"use client";
import React, { useState, useEffect } from "react";
import DailogeLogin from "./DailogeLogin";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useLanguage } from '@/contexts/LanguageContext';

function Header() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State for toggling the menu
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem("isAdmin");
    if (isAdminLoggedIn === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (loggedIn: boolean) => {
    if (loggedIn) {
      localStorage.setItem("isAdmin", "true");
      setIsAdmin(true);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="headWhenPrint sticky top-0 z-50 bg-white shadow-md mb-2 text-black" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-4 cursor-pointer transform hover:scale-105 transition-transform duration-200"
            onClick={() => router.push("/")}
          >
            <Image
              width={48}
              height={48}
              src="/logo.PNG"
              alt="logo"
              className="rounded-lg shadow-sm"
            />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {t('header.home')}
            </Link>
            <Link 
              href="/aboutUs" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              {t('header.aboutUs')}
            </Link>
            {isAdmin && (
              <Link 
                href="/dashboardAdmin" 
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {t('header.dashboard')}
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <DailogeLogin onAdminLogin={handleAdminLogin} />
            
            {/* Language switcher */}
            <Button
              onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
              variant="outline"
              className="px-4 py-2"
            >
              {language === 'ar' ? 'Français' : 'العربية'}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              onClick={toggleMenu}
              className="md:hidden focus:outline-none"
              variant="ghost"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-white shadow-lg rounded-b-lg">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              onClick={toggleMenu}
            >
              {t('header.home')}
            </Link>
            <Link
              href="/aboutUs"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
              onClick={toggleMenu}
            >
              {t('header.aboutUs')}
            </Link>
            {isAdmin && (
              <Link
                href="/dashboardAdmin"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                onClick={toggleMenu}
              >
                {t('header.dashboard')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
