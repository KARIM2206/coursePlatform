/** @type {import('next').NextConfig} */
const nextConfig = {
  // No need for experimental.appDir in Next.js 15
  // Other configuration options can go here
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;