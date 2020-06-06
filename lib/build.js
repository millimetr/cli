#!/usr/bin/env node

/**
 * Embedded constants
 */

const CWD = process.cwd();

/*
 * Project modules
 */

const core = require('./core');
const config = require(`${CWD}/millimetr.config.js`);

/**
 * Primary export
 */

const build = () => config().then(core);

module.exports = build;