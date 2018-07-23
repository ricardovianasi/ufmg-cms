var argv = require('yargs').argv;

var basePath = 'build';

function getPort() {
    return argv.port === undefined ? 3000 : 5000;
}

function getBasePath() {
    return './' + getPort() + '-' + basePath;
}

var commons = {
    getBasePath: getBasePath,
    getPort: getPort
};

module.exports = commons;
