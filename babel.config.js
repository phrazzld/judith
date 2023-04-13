module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          extensions: [
            ".js",
            "jsx",
            ".ts",
            ".tsx",
            ".ios.js",
            ".ios.tsx",
            ".android.js",
            ".android.tsx",
          ],
          alias: {
            "judith": "./",
          },
        },
      ],
    ],
  };
};
