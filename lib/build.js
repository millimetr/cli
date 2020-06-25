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
const pretty = require('pretty');

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

const generateXmlSitemap = async (args, routes) => {
    if (!args.sitemap.siteUrl || !args.sitemap.output) {
        throw new Error('Incorrect options passed to sitemap object');
    }

    const content = pretty(`
        <?xml version="1.0" encoding="UTF-8"?>

        <urlset 
            xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
        >
            ${routes.filter(({ url }) => url !== '/').map(({ url }) => `
                <url>
                    <loc>${args.sitemap.siteUrl}${url}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <priority>${url === '/' ? 1.00 : 0.8}</priority>
                </url>
            `).join('\n')}
        </urlset>
    `, { ocd: true })

    const sitemapPath = resolvePath(CWD, args.output, args.sitemap.output);
    await fsAsPromises.writeFile(sitemapPath, content);
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
        await generateXmlSitemap(args, routes);
    }

    const elapsedTime = new Date().getTime() - startTime;
    const roundedTime = Math.ceil(elapsedTime / MILLISECONDS_IN_SECOND) || 1;
    
    console.log(
        chalk.green(`\nBuild completed under ${roundedTime} ${pluralize('second', roundedTime)}!\n`)
    );
});

module.exports = build;