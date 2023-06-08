const swc = require('@swc/core')
const fs = require('fs');
const path = require('path');
const baseDirectory = __dirname;
// console.log(baseDirectory)
fs.readdir(baseDirectory, (err, files) => {
    files.forEach((file) => getAST(file))
})
function getAST(file) {
    // console.log(file)
    const filePath = path.join(baseDirectory , file);
    if(file === 'swcParser.js' || fs.statSync(filePath).isDirectory() || !file.match(/(\w*)\.js$/)) return ;
    // console.log(filePath)
    const data = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    swc.parse(data).then((module) => {
        fs.writeFile(path.join(`${__dirname}, '/../parsed/parsed-${file}`), JSON.stringify(module.body) , (err)=> console.log(err));
        // console.log(module.body)
    })
}