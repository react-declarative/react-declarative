const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

try {
    const package = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString())
    Object.keys(package.peerDependencies).forEach((name) => {
        rimraf(path.join(__dirname, `../node_modules/${name}`), () => null)
    })
} catch {
}
