
var Promise = require('bluebird');

var path = require('path');
var fs = Promise.promisifyAll(require("fs"));
var spawn = require('child_process').spawn;

module.exports = function ( screens ) {

  return new Promise(function (resolve, reject) {

    var tmpDir = os.tmpdir();

    var filepaths = [];

    for (var i = 0; i < screens; i++) {
      filepaths.push( path.join( tmpDir, 'screen' + i + '.png' ) );
    }

    var args = ['-x'].concat(filepaths);

    var screencapture = spawn('/usr/sbin/screencapture', args);

    var error = '';
    screencapture.stderr.on('data', function (chunk) {
      error += chunk;
    });

    screencapture.on('exit', function (code, signal) {

      if ( error.length === 0 && code === 0 ) {
        resolve( filepaths );
      } else {
        reject( new Error(error) );
      }

    });

  }).map(function (filepath) {

    return fs.readFileAsync(filepath);

  });

}
