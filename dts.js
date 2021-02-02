const dts = require('dts-bundle');
const path = require('path');
const fs = require('fs');
 
function abs(subdir) {
    return path.join(__dirname, subdir);
}

dts.bundle({
    name: 'react-view-builder',
    main: 'dist/index.d.ts',
});

fs.copyFileSync(
    abs('dist/react-view-builder.d.ts'),
    abs('example/src/react-view-builder.d.ts'),
);

fs.copyFileSync(
    abs('dist/react-view-builder.d.ts'),
    abs('umd/src/react-view-builder.d.ts'),
);
