# frontwerk 🛠️

CLI toolbox for common scripts for frontend projects that includes:

* JS linting with [ESLint][eslint]
* JS testing with [Jest][jest]
* JS formatting with [Prettier][prettier]
* Check JS for type errors with [Flow][flow]
* CSS/SCSS linting with [Stylelint][stylelint]
* Compile your JS with [Babel][babel]
* Build your JS with [Rollup][rollup]
* Build your app with [Webpack][webpack]

Coming soon:

* Easily eject from using frontwerk (similar to [react-scripts][react-scripts]'s
  eject)
* [Typescript][typescript] support

<hr />

## The problem

Working on multiple frontend projects where you need to set up the same tools
and processes and then maintain them across all of them is a tideous job.

## This solution

**frontwerk** is a CLI that abstracts away all those processes and configuration
and exposes the same API that you can use across all your projects.

You can pick and choose which tools to use (i.e. if you don't want to format
your JS with prettier, you don't have to).

## Inspiration

This is heavily inspired by [kcd-scripts][kcd-scripts] by the amazing Kent C.
Dodds (you should definitely follow him on [Twitter][twitter-kentcdodds] by the
way) and [react-scripts][react-scripts].

So why not just use `kcd-scripts`? You absolutely should! We're not in a
zero-sum game here. I basically wanted to learn how he created everything
without even knowing I'd get this far!

# Installation and usage

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```shell
npm install --save-dev frontwerk
```

or with [yarn][yarn]:

```shell
yarn add --dev frontwerk
```

## Usage

This is a CLI and exposes a bin called `frontwerk`. You can run

```shell
frontwerk
```

with no arguments to show a list of available commands. Or simply checkout the
`src/scripts` directory for all the available scripts.

Then simply ammend your `package.json` `scripts` property to include the scripts
you want to use:

```json
{
  "scripts": {
    "lint:js": "frontwerk lint",
    "lint:css": "frontwerk stylelint",
    "test": "frontwerk test --no-watch",
    "test:watch": "frontwerk test",
    "build": "frontwerk build",
    "format": "frontwerk prettier"
  }
}
```

## Overriding the configuration

Although it works out of the box, **frontwerk** allows you to specify your own
config for the various scripts, either by extending the config provided or just
by using your own, depending on the script. **frontwerk** respects the
convention used by each of its underlying tools (eslint, stylelint, flow, etc.).
Basically, if it's possible with that tool, it's possible with frontwerk.

**Example with ESLint**

```json
{
  "extends": "./node_modules/frontwerk/eslint.js",
  "rules": {}
}
```

or, simply start with your own config to pass to ESLint:

```json
{
  "extends": "google"
}
```

> Note that eslintignore is _coincidentally_ ignored, so until
> [this issue](https://github.com/eslint/eslint/issues/9227) is resolved, please
> pass the eslint ignore as allowed by
> [eslint's configuration](https://eslint.org/docs/user-guide/configuring).

## Documentation

You can find more extensive documentation about each tool here:

* [lint:js][docs-lintjs]
* [lint:css][docs-lintcss]
* [format][docs-format]
* [test][docs-test]
* [build][docs-build]

# LICENSE

MIT

[eslint]: https://eslint.org/
[jest]: https://facebook.github.io/jest/
[prettier]: https://prettier.io/
[flow]: https://flow.org/
[stylelint]: https://stylelint.io/
[babel]: https://babeljs.io/
[rollup]: https://rollupjs.org/
[webpack]: https://webpack.js.org/
[typescript]: http://www.typescriptlang.org/
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
[node]: https://nodejs.org
[react-scripts]: https://www.npmjs.com/package/react-scripts
[kcd-scripts]: https://github.com/kentcdodds/kcd-scripts/
[twitter-kentcdodds]: https://twitter.com/kentcdodds
[package]: https://www.npmjs.com/package/kcd-scripts
[docs-lintjs]: https://github.com/tricinel/frontwerk/blob/master/docs/lintjs.md
[docs-lintcss]: https://github.com/tricinel/frontwerk/blob/master/docs/lintcss.md
[docs-test]: https://github.com/tricinel/frontwerk/blob/master/docs/test.md
[docs-format]: https://github.com/tricinel/frontwerk/blob/master/docs/format.md
[docs-build]: https://github.com/tricinel/frontwerk/blob/master/docs/build.md
[license]: https://github.com/tricinel/frontwerk/blob/master/LICENSE
