module.exports = {
  plugins: {
    "autoprefixer": {},
    "postcss-import": {},
    "postcss-pxtorem": {
      rootValue: 16,
      unitPrecision: 5,
      propList: ["*"],
      selectorBlackList: ["html", "body"],
      replace: true,
      mediaQuery: false,
      minPixelValue: 0
    },
    "postcss-nested": {}
  }
};
