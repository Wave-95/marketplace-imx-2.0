const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['card.godsunchained.com', 'rippin-imx-collection-test.s3.us-west-1.amazonaws.com'],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
