<!-- omit in toc -->
# 📏 millimetr-cli

**Contains both build and develop scripts for millimetr projects**

- [Files](#files)
  - [`index.js`](#indexjs)
  - [`core.js`](#corejs)
  - [`build.js`](#buildjs)
  - [`serve.js`](#servejs)

## Files

### `index.js`

Entry file that destructures passed arguements and loads either `build.js` or `serve.js` depending on passed command.

### `core.js`

File that contains the primary logic that consumes the `millimetr.config.js` file and compiles all relevant files into the designated output directory.

### `build.js`

Runs `core.js` once.

### `serve.js`

Runs `core.js` and then initialises a watcher script that reruns `core.js` if any files in the designated `input` directory changes. 