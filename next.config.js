/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Removed: Enables static export - Incompatible with NextAuth
  images: {
    unoptimized: true,  // Might not be needed anymore, keep for now
  },
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Only add this if you're NOT using a custom domain
  // basePath: '/arcta-site',
};

module.exports = nextConfig; 