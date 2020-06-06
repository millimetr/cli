#!/usr/bin/env node

/**
 * Embedded constants
 */

const CWD = process.cwd();
const MILLISECONDS_IN_SECOND = 1000;

/*
 * Third-party modules
 */

const { promises } = require('fs');
const { dirname } = require('path');
const { copy } = require('fs-extra'); 
const { resolve: resolvePath } = require('path');

const pretty = require('pretty');
const mkdirp = require('mkdirp');
const ejs = require('ejs');
const pluralize = require('pluralize');
const chalk = require('chalk');

/**
 * Embedded helper functions
 */

const copyStatic = async (static, output) => new Promise(resolve => {
    const staticPath = resolvePath(CWD, static);
    const outputPath = resolvePath(CWD, output);

    copy(staticPath, outputPath, (error) => { 
        if (error) {
            throw error;
        }
        
        resolve()
    });
});

const compileEjs = (templatePath, singleRoute) => new Promise(resolve => {
    ejs.renderFile(templatePath, singleRoute, {}, (error, html) => {
        if (error) {
            throw error;
        }

        resolve(pretty(html, { ocd: true }));
    });
})

const createUrlPath = (url, output) => {
    if (url !== '/' && !(/^\/.+/.test(url))) {
        throw new Error('Route url should be a relative path - i.e. starting with "/"')
    }

    if (url === '/') {
        return resolvePath(
            CWD, 
            output,
            'index.html',
        );
    }

    return resolvePath(
        CWD, 
        output,
        url.replace(/^\//, ''),
        'index.html',
    );
}

/**
 * Primary export
 */

const core = async ({ static, output, routes }) => {
    console.log(
        chalk.cyan('Creating routes...')
    );
    
    const startTime = new Date().getTime();

    const outputPath = resolvePath(CWD, output);
    await mkdirp(outputPath)

    await routes.map(async (singleRoute) => {
        const templatePath = resolvePath(CWD, singleRoute.template);
        const compiled = await compileEjs(templatePath, singleRoute);

        const urlPath = createUrlPath(singleRoute.url, output);
        await mkdirp(dirname(urlPath))
        await promises.writeFile(urlPath, compiled);

        console.log(
            chalk.cyan(`  • ${singleRoute.url}`)
        );
    });

    if (static) {
        await copyStatic(static, output);
        chalk.cyan('\nStatic folder copied')
    }

    const elapsedTime = new Date().getTime() - startTime;
    const roundedTime = Math.ceil(elapsedTime / MILLISECONDS_IN_SECOND) || 1;

    console.log(
        chalk.green(`\nBuild completed under ${roundedTime} ${pluralize('second', roundedTime)}!\n`)
    );
}

module.exports = core;
