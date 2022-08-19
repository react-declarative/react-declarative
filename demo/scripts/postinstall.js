const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

function copyFolderSync(from, to) {
    fs.mkdirSync(to)
    fs.readdirSync(from).forEach(element => {
        if (fs.lstatSync(path.join(from, element)).isFile()) {
            fs.copyFileSync(path.join(from, element), path.join(to, element))
        } else {
            copyFolderSync(path.join(from, element), path.join(to, element))
        }
    });
}

rimraf(path.join(__dirname, `../node_modules/react-declarative`), () => null)

copyFolderSync(path.join(__dirname, `../../dist`), path.join(__dirname, `../node_modules/react-declarative`))
