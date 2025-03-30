/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['randomuser.me', 'picsum.photos'],
  },
  devIndicators: false,
};

export default nextConfig;
