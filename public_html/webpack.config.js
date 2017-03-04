module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: "./",
    filename: "output.bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0'],
          plugins: ['istanbul']
        }
      }
    ]
  }
};
