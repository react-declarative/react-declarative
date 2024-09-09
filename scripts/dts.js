const dts = require('dts-bundle');
const rimraf = require("rimraf");
const glob = require("glob");
const path = require("path");
const fs = require('fs');

const prettierSync = require("@prettier/sync");

dts.bundle({
    name: 'react-declarative',
    main: 'dist/index.d.ts',
});

const formatdef = prettierSync.format(fs.readFileSync('dist/react-declarative.d.ts').toString(), {
    semi: true,
    endOfLine: "auto",
    trailingComma: "all",
    singleQuote: false,
    printWidth: 80,
    tabWidth: 2,
    parser: 'typescript',
});
fs.writeFileSync('dist/react-declarative.d.ts', formatdef)

fs.existsSync("demo") && fs.copyFileSync(
    'dist/index.d.ts',
    'demo/react-declarative.d.ts',
);

glob.sync("./dist/**/*.js.map").forEach((file) => {
    rimraf.sync(file);
});

glob.sync("./dist/**/*.d.ts").forEach((file) => {
    const fileName = path.basename(file);
    fileName !== "react-declarative.d.ts" && rimraf.sync(file);
});

glob.sync("./dist/*").forEach((file) => {
    fs.lstatSync(file).isDirectory() && rimraf.sync(file); 
});

fs.renameSync("./dist/react-declarative.d.ts", "./dist/index.d.ts")

