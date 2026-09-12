/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,

    remotePatterns: [
      { protocol: "http", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },

      { protocol: "http", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },

      // Unsplash
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  serverExternalPackages: ["@prisma/client", "pg"],

  turbopack: {
    resolveAlias: {
      ".prisma/client/default": "./node_modules/.prisma/client/default.js",
    },
  },
};

export default nextConfig;