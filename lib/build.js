#!/usr/bin/env node

/**
 * Embedded constants
 */

const CWD = process.cwd();
const MILLISECONDS_IN_SECOND = 1000;

/**
 * Third-party modules
 */

const { resolve: resolvePath } = require('path');
const { removeSync } = require('fs-extra');

/*
 * Project modules
 */

const core = require('./core');
const config = require(`${CWD}/millimetr.config.js`);
const pluralize = require('pluralize');
const chalk = require('chalk');

/**
 * Primary export
 */

const build = () => config().then(async (args) => {
    console.log(
        chalk.cyan('Creating routes...')
    );

    const startTime = new Date().getTime();

    const outputPath = resolvePath(CWD, args.output);
    removeSync(outputPath)

    await core(args);

    const elapsedTime = new Date().getTime() - startTime;
    const roundedTime = Math.ceil(elapsedTime / MILLISECONDS_IN_SECOND) || 1;
    
    console.log(
        chalk.green(`\nBuild completed under ${roundedTime} ${pluralize('second', roundedTime)}!\n`)
    );
});

module.exports = build;