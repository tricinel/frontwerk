# frontwerk 🛠️ formats your javascript

For your JS files using [Prettier][prettier].

## Default configuration

By default, `frontwerk` will use the following prettier rules:

```json
{
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: "none",
  bracketSpacing: true,
  jsxBracketSameLine: false
}
```

## Overriding the defaults

`frontwerk` follows Prettier's way of creating configuration and ignore files.

**Config**

There are three possible ways to extend or create your prettier config.

1. Create a file named `.prettierrc` or `prettier.config.js` in your project
   root.
2. Have an `prettierrc` property in your `package.json`.
3. Pass a `--config` argument with your prettier task.

You can override the default config by creating an `prettier.config.js` or
`.prettierrc` file.

```json
{
  printWidth: 100,
  tabWidth: 4,
  useTabs: true,
  semi: true,
  singleQuote: true,
  trailingComma: "none",
  bracketSpacing: true,
  jsxBracketSameLine: true
}
```

You can also add a property `prettierrc` to your `package.json` and extend or
replace the defaults there.

```json
{
  "prettierrc": {
    printWidth: 100,
    tabWidth: 4,
    useTabs: true,
    semi: true,
    singleQuote: true,
    trailingComma: "none",
    bracketSpacing: true,
    jsxBracketSameLine: true
  }
}
```

Another way to do it is by passing a `--config` flag to your `frontwerk format`
task with a path to a file to use as a configuration file.

```json
{
  "scripts": {
    "format": "frontwerk prettier --config ./myconfig.js"
  }
}
```

**Ignore**

There are two possible ways to create your own prettier ignore.

1. Create a file named `.prettierignore` in your project root.
2. Pass a `--ignore-path` argument with your prettier task.

**Files**

By default, `frontwerk` will look for and prettify all files with the following
extensions: js, json, less, css, ts, md in your root, recursively, ignoring
whatever is passed in the ignore. In order to override this behavior, you can
simple add the files as an argument to your format task.

```json
{
  "scripts": {
    "format": "frontwerk prettier ./source/**/*.js"
  }
}
```

**Write**

By default, `frontwerk` will write the prettified files. You can of course
override this behavior as well:

```json
{
  "scripts": {
    "format": "frontwerk prettier --no-write"
  }
}
```

[prettier]: https://prettier.io/
