/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'], // النطاقات المسموح بها للصور
  },
  typescript: {
    ignoreBuildErrors: false, // يمكنك تفعيل هذه إذا كنت تواجه أخطاء TypeScript غير مهمة
  },
};

module.exports = nextConfig;
