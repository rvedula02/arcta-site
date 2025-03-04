/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enables static export
  images: {
    unoptimized: true,  // Required for static export
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