# frontwerk 🛠️ builds your app

Build your app with one of the following:

* [BabelJS][babel]
* [RollupJS][rollup]
* [Webpack][webpack]

## Choose your builder

**Babel (default)**

```json
{
  "scripts": {
    "build": "frontwerk build"
  }
}
```

Continue reading about [using babel][docs-babel].

**Rollup**

```json
{
  "scripts": {
    "build": "frontwerk build --bundle"
  }
}
```

Continue reading about [using rollup][docs-rollup].

**Webpack**

```json
{
  "scripts": {
    "build": "frontwerk build --pack"
  }
}
```

Continue reading about [using webpack][docs-webpack].

[babel]: https://babeljs.io/
[rollup]: https://rollupjs.org/
[webpack]: https://webpack.js.org/
[docs-babel]: https://github.com/tricinel/frontwerk/blob/master/docs/babel.md
[docs-rollup]: https://github.com/tricinel/frontwerk/blob/master/docs/rollup.md
[docs-webpack]: https://github.com/tricinel/frontwerk/blob/master/docs/webpack.md
