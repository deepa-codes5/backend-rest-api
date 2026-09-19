var express = require('express');
var fs = require('fs');
var path = require('path');

var router = express.Router();

function removeExtensionFromFile(fileName) {
    return path.parse(fileName).name;
}

var routesPath = __dirname;

router.use('/', require('./auth'));

fs.readdirSync(routesPath)
    .filter((file) => {
        var routeFile = removeExtensionFromFile(file);

        return routeFile !== 'index' && routeFile !== 'auth' && file !== '.DS_Store';
    })
    .forEach((file) => {
        var routeFile = removeExtensionFromFile(file);
        router.use(`/${routeFile}`, require(`./${routeFile}`));
    });

module.exports = router;

