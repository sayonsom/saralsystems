/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dti7egpsg/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/tools/gridlabd/projects', destination: '/projects', permanent: true },
      { source: '/tools/gridlabd/projects/:path*', destination: '/projects/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
