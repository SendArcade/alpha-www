/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "loh3.googleusercontent.com",
    ],
  },
  async headers() {
    return [
      {
        source: '/downloads/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          // You can also optionally set a Content-Type header if needed:
          // { key: 'Content-Type', value: 'application/octet-stream' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
