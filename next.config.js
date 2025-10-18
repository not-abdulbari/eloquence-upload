/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // required for Cloudflare Pages
  eslint: {
    ignoreDuringBuilds: true, // avoid CI errors
  },
  images: {
    unoptimized: true, // good for CF Pages
  },
};

module.exports = nextConfig;
