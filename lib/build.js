#!/usr/bin/env node

/*
 * Embedded constants
 */

const CWD = process.cwd();
const MILLISECONDS_IN_SECOND = 1000;

/*
 * Third-party modules
 */

const { promises: fsAsPromises } = require('fs');
const { resolve: resolvePath } = require('path');
const { removeSync } = require('fs-extra');
const { SitemapStream } = require( 'sitemap' )

/*
 * Project modules
 */

const core = require('./core');
const config = require(`${CWD}/millimetr.config.js`);
const pluralize = require('pluralize');
const chalk = require('chalk');

/*
 * Embedded helper functions
 */

const generateXmlSitemap = async (sitemap, routes) => {
    if (!sitemap.siteUrl || !sitemap.output) {
        throw new Error('Incorrect options passed to sitemap object');
    }

    const stream = new SitemapStream({ hostname: liveUrl });
    routes.forEach(({ url }) => stream.write({ url }));
    stream.end();

    const sitemapData = await streamToPromise(stream);
    const sitemapPath = resolvePath(CWD, sitemap.output);
    await fsAsPromises.writeFile(sitemapPath, sitemapData.toString());
}

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

    const routes = await core(args);

    if (!!args.sitemap) {
        await generateXmlSitemap(args.sitemap, routes);
    }

    const elapsedTime = new Date().getTime() - startTime;
    const roundedTime = Math.ceil(elapsedTime / MILLISECONDS_IN_SECOND) || 1;
    
    console.log(
        chalk.green(`\nBuild completed under ${roundedTime} ${pluralize('second', roundedTime)}!\n`)
    );
});

module.exports = build;