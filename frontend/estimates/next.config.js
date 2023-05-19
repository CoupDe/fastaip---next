/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    appDir: true,
    serverActions: true,
  },

  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  images: {
    domains: ["sun1-92.userapi.com", "avatars.githubusercontent.com"],
  },
};
