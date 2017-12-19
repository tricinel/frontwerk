# frontwerk 🛠️ lints styles

Lint your JS files using [Stylelint][stylelint].

## Default configuration

By default, `frontwerk` will use the following stylelint preset:

* [stylelint-config-standard][stylelint-config-standard]

> Note that any args you pass to `frontwerk stylelint` will be forwarded to
> stylelint.

## Overriding the defaults

`frontwerk` follows Stylelint's way of creating configuration and ignore files.

**Config**

There are three possible ways to extend or create your stylelint config.

1. Create a file named `.stylelintrc` or `stylelint.config.js` in your project
   root.
2. Have an `stylelint` property in your `package.json`.
3. Pass a `--config` argument with your stylelint task.

You can override the default config by creating an `stylelint.config.js` or
`.stylelintrc` file and either by extending the default or completing replacing
it with your own.

```json
{
  "extends": "./node_modules/frontwerk/stylelint.js"
}
```

or

```json
{
  "extends": "stylelint-config-primer"
}
```

You can also add a property `stylelint` to your `package.json` and extend or
replace the defaults there.

```json
{
  "stylelint": {
    "extends": "./node_modules/frontwerk/stylelint.js"
  }
}
```

Another way to do it is by passing a `--config` flag to your `frontwerk
stylelint` task with a path to a file to use as a configuration file.

```json
{
  "scripts": {
    "lint:css": "frontwerk stylelint --config ./myconfig.js"
  }
}
```

**Ignore**

There are two possible ways to create your own stylelint ignore.

1. Create a file named `.stylelintignore` in your project root.
2. Pass a `--ignore-path` argument with your lint task.

**Files**

By default, `frontwerk` will look for and lint all the CSS, SASS and SCSS files
in your root, recursively, ignoring whatever is passed in the ignore. In order
to override this behavior, you can simple add the files as an argument to your
lint task.

```json
{
  "scripts": {
    "lint:css": "frontwerk stylelint ./source/**/*.css"
  }
}
```

**Cache**

By default, `frontwerk` will use cache and store the info about processed files
in order to only operate on the changed ones. You can of course override this
behavior as well:

```json
{
  "scripts": {
    "lint:css": "frontwerk stylelint --no-cache"
  }
}
```

**Colors**

By default, `frontwerk` will use colors in its output. You can of course
override this behavior as well:

```json
{
  "scripts": {
    "lint:css": "frontwerk stylelint --no-color"
  }
}
```

[stylelint]: https://stylelint.io/
[stylelint-config-standard]: https://www.npmjs.com/package/stylelint-config-standard
