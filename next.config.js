/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/media',
        destination: '/media/books',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  images: {
    domains: ['www.iamrob.in', 'assets.literal.club', 'lastfm.freetls.fastly.net', 'open.spotify.com', 'res.cloudinary.com'],
    unoptimized: true,
  },
}

module.exports = nextConfig
