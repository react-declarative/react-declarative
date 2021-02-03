const TerserPlugin = require("terser-webpack-plugin");

const path = require('path');
const { exec } = require('child_process');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  mode: 'production',
  output: {
    filename: 'react-view-builder.min.js',
    path: path.resolve(__dirname, './dist'),
    library: 'viewBuilder',
    libraryTarget: 'umd',
  },
  externals: {
    'react-dom': 'ReactDOM',
    'react': 'React',
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
    hints: false,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
          exec('node -e "try{require(\'./postbuild\')}catch(e){}"', (err, stdout, stderr) => {
            if (stdout) process.stdout.write(stdout);
            if (stderr) process.stderr.write(stderr);
          });
        });
      }
    }
  ]
};
