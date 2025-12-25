/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 🚀 NEW: Replaces 'domains' with 'remotePatterns'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**', // Allow all paths from TMDB
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Allow Google Auth avatars
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
