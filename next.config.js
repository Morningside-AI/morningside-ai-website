// next.config.js
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((/** @type {{ test: { test: (arg0: string) => any; }; }} */ rule) =>
      rule?.test?.test?.(".svg")
    );
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              icon: true,
              svgo: true,
              svgoConfig: {
                plugins: [{ name: "removeViewBox", active: false }],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: "asset/resource",
      }
    );

    return config;
  },
};

export default config;
