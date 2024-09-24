import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import million from "million/compiler";
import path from 'path';

export default {
  input: 'src/index.ts', // Your TypeScript entry point
  output: [
    {
      file: path.join('dist', 'index.js'),
      format: 'cjs',
    },
    {
      file: path.join('dist', 'index.esm.js'),
      format: 'esm',
    }
  ],
  plugins: [
    million.rollup({ auto: true }),
    peerDepsExternal({
      includeDependencies: true,
    }),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    terser()
  ],
  external: ['react', 'react-dom']
};
