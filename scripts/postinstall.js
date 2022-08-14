const rimraf = require('rimraf');
const fs = require('fs');

try {
    const package = JSON.parse(fs.readFileSync('./package.json').toString())
    Object.keys(package.peerDependencies).forEach((name) => {
        rimraf(`./node_modules/${name}`, () => null);
    })
} catch {
}
