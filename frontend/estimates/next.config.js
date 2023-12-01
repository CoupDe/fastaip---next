/** @type {import('next').NextConfig} */
module.exports = {


  // webpack(config) {
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sun1-92.userapi.com',

      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',

      },

    ],
  },
};
webpack: (config) => {
  let modularizeImports = null;
  config.module.rules.some((rule) =>
    rule.oneOf?.some((oneOf) => {
      modularizeImports = oneOf?.use?.options?.nextConfig?.modularizeImports;
      return modularizeImports;
    })
  );
  if (modularizeImports?.["@headlessui/react"])
    delete modularizeImports["@headlessui/react"];
  return config;
};
