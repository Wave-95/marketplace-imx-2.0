/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['card.godsunchained.com'],
  },
};

module.exports = nextConfig;
