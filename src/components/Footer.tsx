import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="headWhenPrint bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-4">Your Company Name</h3>
            <div className="space-y-2">
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FaPhone className="text-gray-400" />
                <span>+1 234 567 8900</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-gray-400" />
                <span>contact@yourcompany.com</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-2">
                <FaMapMarkerAlt className="text-gray-400" />
                <span>123 Business Street, City, Country</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-gray-300 transition-colors">About Us</a></li>
              <li><a href="/services" className="hover:text-gray-300 transition-colors">Services</a></li>
              <li><a href="/contact" className="hover:text-gray-300 transition-colors">Contact</a></li>
              <li><a href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-blue-500 transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-gray-300 transition-colors"
              >
                <FaTiktok size={24} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-500 transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://www.whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-green-500 transition-colors"
              >
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-4">
          <div className="text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
