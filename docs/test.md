# frontwerk 🛠️ tests your javascript

Test your JS files using [Jest][jest].

## Default configuration

By default, `frontwerk` will use the following jest rules:

```json
{
  "roots": "src",
  "testEnvironment":
    "jsdom (if not using webpack or rollup or react) or node otherwise",
  "collectCoverageFrom": ["src/**/*.js"],
  "testMatch": ["**/__tests__/**/*.js"],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "/fixtures/",
    "/__tests__/helpers/",
    "__mocks__"
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/fixtures/",
    "/__tests__/helpers/",
    "__mocks__",
    "src/(umd|cjs|esm)-entry.js$"
  ],
  "transformIgnorePatterns": ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$"],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## Overriding the defaults

`frontwerk` allows for easy extension and configuration of this default config.

> Note that any args you pass to `frontwerk test` will be forwarded to jest.

**Config**

There are two possible ways to extend or create your jest config.

1. Create a file named `jest.config.js` in your project root and pass it using
   the `--config` to your test task.
2. Have a `jest` property in your `package.json`.

You can override the default config by creating a `jest.config.js` file.

```javascript
const { jest: jestConfig } = require('frontwerk/config');
module.exports = Object.assign(jestConfig, {
  // your overrides here
});
```

Add pass a `--config` flag to your `frontwerk format` task with a path to a file
to use as a configuration file.

```json
{
  "scripts": {
    "test": "frontwerk test --config ./jest.config.js"
  }
}
```

**Options**

There are a few CLI flags you can use:

* `--no-watch` will not watch the files for changes. The default is `watch`.
* `--coverage` will display a coverage report and also override `watch`.
* `--updateSnapshot` will update snapshots and also override `watch`.

[jest]: https://facebook.github.io/jest/
