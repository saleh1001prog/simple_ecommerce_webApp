/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      // أضف أي مصادر أخرى للصور تستخدمها في تطبيقك
    ],
  },
  // ... باقي الإعدادات
};

module.exports = nextConfig; 