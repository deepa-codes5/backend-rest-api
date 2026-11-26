
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

        return routeFile !== 'index' &&
               routeFile !== 'auth' &&
               file !== '.DS_Store' &&
               file.endsWith('.js');
    })
    .forEach((file) => {
        var routeFile = removeExtensionFromFile(file);

        console.log("Checking route:", routeFile);

        try {
            const route = require(`./${routeFile}`);

            console.log("Route type:", routeFile, typeof route);

            if (typeof route !== "function") {
                console.log("INVALID ROUTE EXPORT:", routeFile);
                return;
            }

            router.use(`/${routeFile}`, route);

        } catch (error) {
            console.log("ROUTE LOAD ERROR:", routeFile);
            console.log(error.message);
            throw error;
        }
    });

module.exports = router;
