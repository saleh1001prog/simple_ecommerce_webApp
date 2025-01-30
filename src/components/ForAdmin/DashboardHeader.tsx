import Link from 'next/link';
import React, { useState } from 'react';
import { FiMenu, FiX, FiPlus, FiShoppingBag, FiGrid } from 'react-icons/fi';
import { Button } from '../ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const menuItems = [
    { 
      href: '/dashboardAdmin/addProducts', 
      icon: <FiPlus />, 
      label: t('dashboard.addProducts')
    },
    { 
      href: '/dashboardAdmin/productsOrders', 
      icon: <FiShoppingBag />, 
      label: t('dashboard.orders')
    },
    { 
      href: '/dashboardAdmin/ProductsStudio', 
      icon: <FiGrid />, 
      label: t('dashboard.productsStudio')
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              {t('dashboard.title')}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 rtl:space-x-reverse" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
              >
                <span className="mr-2 rtl:ml-2 rtl:mr-0">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-200" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <div className="space-y-1 px-4 py-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-3 rtl:ml-3 rtl:mr-0 text-gray-500">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default DashboardHeader;
