import Link from 'next/link';
import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className=" header bg-white text-slate-900 p-4 flex justify-between items-center relative ">
      <div className="text-xl">Dashboard</div>
      
      {/* Desktop Menu */}
      <nav className="hidden md:flex flex-row gap-x-4">
        <Link href="/dashboardAdmin/addProducts" className="hover:underline">
          Add Products
        </Link>
        <Link href="/dashboardAdmin/productsOrders" className="hover:underline">
          Products Orders
        </Link>
        <Link href="/dashboardAdmin/ProductsStudio" className="hover:underline">
          Products Studio
        </Link>
      </nav>
      
      {/* Mobile Menu Icon */}
      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <nav className="absolute top-full left-0 w-full bg-white text-black p-4 flex flex-col space-y-2 md:hidden">
          <Link href="/dashboardAdmin/addProducts" className="hover:underline p-3  border-b-2 border-zinc-100 " onClick={toggleMenu}>
            Add Products
          </Link>
          <Link href="/dashboardAdmin/productsOrders" className="hover:underline  p-3  border-b-2 border-zinc-100" onClick={toggleMenu}>
            Products Orders
          </Link>
          <Link href="/dashboardAdmin/ProductsStudio" className="hover:underline  p-3 border-b-2 border-zinc-100" onClick={toggleMenu}>
            Products Studio
          </Link>
        </nav>
      )}
    </div>
  );
}

export default DashboardHeader;
