"use client";
import React, { useState, useEffect } from "react";
import DailogeLogin from "./DailogeLogin";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";

function Header() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // State for toggling the menu
  const router = useRouter();

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
    <div className="headWhenPrint bg-white mb-2 text-black p-4 flex justify-between items-center relative">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")} // Navigate to the home page
      >
        <Image
          width={48}
          height={48}
          src="/logo.PNG"
          alt="logo"
          className="rounded-lg"
        />
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex flex-row gap-x-4">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/aboutUs" className="hover:underline">
          About Us
        </Link>
        {isAdmin && (
          <Link href="/dashboardAdmin" className="hover:underline">
            Dashboard
          </Link>
        )}
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
        <nav className="absolute z-50 top-full right-0 w-full bg-white text-black p-4 flex flex-col space-y-2 md:hidden">
          <Link
            href="/"
            className="hover:underline p-3 border-b-2 border-zinc-100"
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link
            href="/aboutUs"
            className="hover:underline p-3 border-b-2 border-zinc-100"
            onClick={toggleMenu}
          >
            About Us
          </Link>
          {isAdmin && (
            <Link
              href="/dashboardAdmin"
              className="hover:underline p-3 border-b-2 border-zinc-100"
              onClick={toggleMenu}
            >
              Go to Dashboard
            </Link>
          )}
        </nav>
      )}

      <DailogeLogin onAdminLogin={handleAdminLogin} />
    </div>
  );
}

export default Header;
