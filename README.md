<!-- omit in toc -->
# ⚙️ millimetr CLI

[![](https://img.shields.io/npm/v/@millimetr/cli)](http://npm.im/@millimetr/cli) ![](https://github.com/millimetr/cli/workflows/NPM%20Package/badge.svg)

**Contains all CLI scripts used in millimetr projects**

- [Files](#files)
  - [`index.js`](#indexjs)
  - [`core.js`](#corejs)
  - [`build.js`](#buildjs)
  - [`serve.js`](#servejs)
- [Technologies](#technologies)

## Files

### `index.js`

Entry file that destructures passed arguements and loads either `build.js` or `serve.js` depending on passed command.

### `core.js`

File that contains the primary logic that consumes the `millimetr.config.js` file and compiles all relevant files into the designated output directory.

### `build.js`

Runs `core.js` once.

### `serve.js`

Runs `core.js` and then initialises a watcher script that reruns `core.js` if any files in the designated `input` directory changes. 

## Technologies

- [Watch](https://github.com/mikeal/watch) and [Browser Sync](https://www.browsersync.io/) used for live reloading during development.
- [Chalk](https://github.com/chalk/chalk) and [Pluralize](https://github.com/blakeembrey/pluralize) is used to display pretty messages to the terminal/command-line.
- [EJS](https://ejs.co) is used to compile EJS templates into HTML and [Pretty](https://github.com/jonschlinkert/pretty) is used to format output HTML.
- [Yargs](https://yargs.js.org) is used to parse arguments passed via the terminal/command-line.
- [fs-extra](https://github.com/jprichardson/node-fs-extra) and [mkdirp](https://github.com/isaacs/node-mkdirp) is used to create output folder and file structure.