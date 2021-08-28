const path = require('path');
const fs = require('fs');
 
function abs(subdir) {
    return path.join(__dirname, subdir);
}

fs.copyFileSync(
    abs('./src/react-declarative.d.ts'),
    abs('./dist/react-declarative.d.ts'),
);

fs.copyFileSync(
    abs('./src/index.d.ts'),
    abs('./dist/index.d.ts'),
);
