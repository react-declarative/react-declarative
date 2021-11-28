const dts = require('dts-bundle');
const path = require('path');
const fs = require('fs');
 
function abs(subdir) {
    return path.join(__dirname, subdir);
}

dts.bundle({
    name: 'react-declarative',
    main: 'dist/index.d.ts',
});

fs.copyFileSync(
    abs('dist/react-declarative.d.ts'),
    abs('demo/src/react-declarative.d.ts'),
);

fs.copyFileSync(
    abs('dist/react-declarative.d.ts'),
    abs('umd/src/react-declarative.d.ts'),
);
