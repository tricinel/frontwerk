const path = require('path');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');
const rollupBabel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify');
const nodeBuiltIns = require('rollup-plugin-node-builtins');
const nodeGlobals = require('rollup-plugin-node-globals');
const nodeResolve = require('rollup-plugin-node-resolve');

const { hasPkgProp } = require('../utils/pkg');
const { pkg } = require('../utils/pkg');
const { parseEnv } = require('../utils/parseEnv');
const { fileExists } = require('../utils/fileExists');
const { capitalize } = require('../utils/strings');
const { toCamelCase } = require('../utils/strings');

const format = process.env.BUILD_FORMAT;
const minify = parseEnv('BUILD_MINIFY', false);
const filenamePrefix = process.env.BUILD_FILENAME_PREFIX || '';
const filenameSuffix = process.env.BUILD_FILENAME_SUFFIX || '';
const isNode = parseEnv('BUILD_NODE', false);
const name = process.env.BUILD_NAME || capitalize(toCamelCase(pkg.name));

const peerDependencies = Object.keys(pkg.peerDependencies || {});

const defaultGlobals = peerDependencies.reduce((deps, dep) => {
  deps[dep] = capitalize(toCamelCase(dep));
  return deps;
}, {});

const filename = [
  pkg.name,
  filenameSuffix,
  `.${format}`,
  minify ? '.min' : null,
  '.js'
]
  .filter(Boolean)
  .join('');

const filepath = path.join(
  ...[filenamePrefix, 'dist', filename].filter(Boolean)
);

const esm = format === 'esm';

const input = process.env.BUILD_INPUT || 'src/index.js';
const output = [{ file: filepath, format: esm ? 'es' : format, name }];
const external = parseEnv('BUILD_EXTERNAL', peerDependencies);
const globals = parseEnv('BUILD_GLOBALS', defaultGlobals);

const here = p => path.join(__dirname, p);
const useBuiltinConfig = !fileExists('.babelrc') && !hasPkgProp('babel');
const babelPresets = useBuiltinConfig ? [here('../config/babelrc.js')] : [];

module.exports = {
  input,
  output,
  exports: esm ? 'named' : 'default',
  external,
  globals,
  plugins: [
    isNode ? nodeBuiltIns() : null,
    isNode ? nodeGlobals() : null,
    nodeResolve({ preferBuiltins: isNode, jsnext: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    json(),
    rollupBabel({
      exclude: 'node_modules/**',
      presets: babelPresets,
      babelrc: true
    }),
    minify ? uglify() : null
  ].filter(Boolean)
};
