/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add remote patterns here when you plug in a CDN (Cloudinary, R2, etc.)
    remotePatterns: [],
  },
};

export default nextConfig;
