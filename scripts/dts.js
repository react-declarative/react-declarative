const dts = require('dts-bundle');
const rimraf = require("rimraf");
const fs = require('fs');

const { createMinifier } = require("dts-minify");
const ts = require("typescript");
const minifier = createMinifier(ts);

dts.bundle({
    name: 'react-declarative',
    main: 'dist/types/index.d.ts',
});

// @description remove this comment to enable d.ts minification
// const typedef = minifier.minify(fs.readFileSync('dist/types/react-declarative.d.ts').toString());
// fs.writeFileSync('dist/types/react-declarative.d.ts', typedef);

fs.copyFileSync(
    'dist/types/react-declarative.d.ts',
    'dist/index.d.ts',
);

fs.copyFileSync(
    'dist/common/index.js',
    'dist/index.js',
);

fs.copyFileSync(
    'dist/modern/index.js',
    'dist/index.modern.js',
);

fs.copyFileSync(
    'dist/index.d.ts',
    'demo/src/react-declarative.d.ts',
);

rimraf.sync("dist/types");
rimraf.sync("dist/common");
rimraf.sync("dist/modern");
