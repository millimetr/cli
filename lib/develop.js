#!/usr/bin/env node

/**
 * Embedded constants
 */

const CWD = process.cwd();

/*
 * Third-party modules 
 */

const { resolve: resolvePath } = require('path');
const { removeSync } = require('fs-extra');
var browserSync = require("browser-sync").create();

/*
 * Project modules
 */

const core = require('./core');
const config = require(`${CWD}/millimetr.config.js`);

/**
 * Primary export
 */

const develop = () => config().then(async ({ static, ...otherArgs }) => {
    const staticPath = resolvePath(CWD, static);
    const outputPath = resolvePath(CWD, output);
    
    removeSync(outputPath);

    const handleCore = async () => core(otherArgs);
    await handleCore();

    browserSync.init({
        server: [outputPath, staticPath],
        open: true,
        files: [outputPath, staticPath],
        ui: {
            port: 8080,
        }
    })

    browserSync.watch(`${input}/**/*.ejs`, { ignoreInitial: true }, handleCore)
});

module.exports = develop;