#!/usr/bin/env node

/*
 * Third-party modules
 */

const argv = require('yargs').argv

/**
 * Primary side-effect
 */

const command = argv._[0];

if (command === 'build') {
    require('./build')();
}

 
if (command === 'develop') {
    require('./develop')();
}
