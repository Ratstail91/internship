module.exports = {
  entry: "./src/index.jsx",
  output: {
    path: "./",
    filename: "output.bundle.js"
  },
  module: {
    loaders: [
      {
        test: new RegExp('jsx?$'),
        loader: 'babel-loader',
        exclude: new RegExp('./node_modules'),
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['istanbul']
        }
      }
    ]
  }
};
