#!/usr/bin/env node

/**
 * Embedded constants
 */

const CWD = process.cwd();

/*
 * Third-party modules 
 */

const { watchTree } = require('watch');
const { resolve: resolvePath } = require('path');
var browserSync = require("browser-sync").create();

/*
 * Project modules
 */

const core = require('./core');
const config = require(`${CWD}/millimetr.config.js`);

/**
 * Primary export
 */

const develop = () => config().then(async ({ static, output, routes, input }) => {
    const build = async () => core({ static, output, routes });

    await build();

    const outputPath = resolvePath(CWD, output);
    
    browserSync.init({
        server: outputPath,
        open: true,
        files: outputPath,
        ui: {
            port: 8080,
        }
    })

    const inputPath = resolvePath(CWD, input);
    watchTree(inputPath, build)
});

module.exports = develop;