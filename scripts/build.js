const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/modern',
  bundle: true,
  minify: true,
  splitting: true,
  format: 'esm',
  target: 'chrome58',
  plugins: [nodeExternalsPlugin()],
});

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/common',
  bundle: true,
  minify: true,
  format: 'cjs',
  target: 'chrome58',
  plugins: [nodeExternalsPlugin()],
});
