// next.config.js
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  async redirects() {
    return [
      { source: "/team", destination: "/", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/blog", destination: "/", permanent: true },

      {
        source: "/careers",
        destination: "https://tally.so/r/wbYr52",
        permanent: true,
      },
      {
        source: "/jobs",
        destination: "https://tally.so/r/wbYr52",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (/** @type {{ test: { test: (arg0: string) => any; }; }} */ rule) =>
        rule?.test?.test?.(".svg"),
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
      },
    );

    return config;
  },
};

export default config;
