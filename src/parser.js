var PEG = require('pegjs');
var fs  = require('fs');

var src = fs.readFileSync([__dirname, 'bumpkin.pegjs'].join('/'));

module.exports = PEG.buildParser(src.toString());
