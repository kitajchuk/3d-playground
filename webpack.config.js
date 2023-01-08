const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const baseConfig = {
  entry: {
    maze: "./src/maze.js",
    video: "./src/video.js",
    sprite: "./src/sprite.js",
    third: "./src/third.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]/bundle.[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|mp4)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: "html"},
        {from: "assets"},
      ],
    }),
  ],
};

module.exports = ( env ) => {
  if ( env.development ) {
    return Object.assign( baseConfig, {
      mode: "development",
      devtool: "inline-source-map",
      devServer: {
        contentBase: [
          path.join(__dirname, "dist"),
          path.join(__dirname, "assets"),
        ],
        compress: true,
        port: 9001,
      },
    });
  } else {
    return Object.assign( baseConfig, {
      mode: "production",
      devtool: false,
    });
  }
};