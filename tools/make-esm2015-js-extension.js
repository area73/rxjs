const FileHound = require('filehound');
const fs = require('fs');

const files = FileHound.create()
.paths(__dirname + '/../dist/esm2015_browser')
.ext('js')
.find();

const replaceImport = data => data.replace(/(import .* from\s+['"])(.*)(?=['"])/g, '$1$2.js');
const replaceExport = data => data.replace(/(export .* from\s+['"])(.*)(?=['"])/g, '$1$2.js');

const writeToFile = (filepath,errFn) => data => fs.writeFile(filepath, data, errFn);
const errorHandler = err => {if (err) {throw new Error(err);}};

const pipe = (...fns) => x => fns.reduce((a,b) => b(a),x);

files.then((filePaths) => {
  filePaths.forEach((filepath) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      pipe(
        replaceImport,
        replaceExport,
        writeToFile(filepath,errorHandler)
      )(data);
    });
  });
});