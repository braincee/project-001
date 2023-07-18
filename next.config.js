/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

module.exports = {
  webpack: (config, { isServer }) => {
    // Add your custom webpack configuration here
    config.module.rules.push({
      test: /\.mp3$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/audio/', // Adjust the output path as needed
            publicPath: '/_next/static/audio/', // Adjust the public path as needed
          },
        },
      ],
    });

    // Important: return the modified config
    return config;
  },
};
