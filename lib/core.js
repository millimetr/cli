#!/usr/bin/env node

/**
 * Embedded constants
 */

const CWD = process.cwd();

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

const core = async ({ static, output, routes, transformInternals }) => {
    const outputPath = resolvePath(CWD, output);
    await mkdirp(outputPath)

    const routesSummary = routes.map(singleRoute => ({ title: singleRoute.title, url: singleRoute.url }));

    await routes.map(async (singleRoute) => {
        const templatePath = resolvePath(CWD, singleRoute.template);
        const internals = { routes: routesSummary, activeRoute: singleRoute.url };

        const compiled = await compileEjs(templatePath, { ...singleRoute, _internals: transformInternals ? transformInternals(internals) : internals });
            
        const urlPath = createUrlPath(singleRoute.url, output);
        await mkdirp(dirname(urlPath))
        await promises.writeFile(urlPath, compiled);

        console.log(
            chalk.cyan(`  • ${singleRoute.title}`)
        );
    });

    if (static) {
        await copyStatic(static, output);
        chalk.cyan('\nStatic folder copied')
    }
}

module.exports = core;
