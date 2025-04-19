// next.config.js
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  webpack(config) {
    // Ignore implicit any error
    // @ts-ignore
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule?.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "removeViewBox",
                  active: false,
                },
              ],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default config;
