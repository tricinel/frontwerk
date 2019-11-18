import path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import rollupBabel from 'rollup-plugin-babel';
import nodeBuiltIns from 'rollup-plugin-node-builtins';
import nodeGlobals from 'rollup-plugin-node-globals';
import nodeResolve from 'rollup-plugin-node-resolve';

import { hasPkgProp, pkg, Dependencies } from '../utils/pkg';
import parseEnv from '../utils/parseEnv';
import fileExists from '../utils/fileExists';
import { capitalize, toCamelCase } from '../utils/strings';

const format = parseEnv<string>('BUILD_FORMAT');
const minify = parseEnv<boolean>('BUILD_MINIFY', false);
const filenamePrefix = parseEnv<string>('BUILD_FILENAME_PREFIX', '');
const filenameSuffix = parseEnv<string>('BUILD_FILENAME_SUFFIX', '');
const isNode = parseEnv<boolean>('BUILD_NODE', false);
const buildName = parseEnv('BUILD_NAME', capitalize(toCamelCase(pkg.name)));

const peerDependencies = Object.keys(pkg.peerDependencies);

const defaultGlobals: Dependencies = peerDependencies.reduce(
  (deps: Dependencies, dep: string) => ({
    ...deps,
    [dep]: capitalize(toCamelCase(dep))
  }),
  {}
);

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

const input = parseEnv<string>('BUILD_INPUT', 'src/index.js');
const output = [
  { file: filepath, format: esm ? 'es' : format, name: buildName }
];
const externalDependencies = parseEnv<string[]>(
  'BUILD_EXTERNAL',
  peerDependencies
);
const globals = parseEnv<Dependencies>('BUILD_GLOBALS', defaultGlobals);

const here = (dirPath: string): string => path.join(__dirname, dirPath);
const useBuiltinConfig = !(fileExists('.babelrc') || hasPkgProp('babel'));
const babelPresets = useBuiltinConfig ? [here('../config/babelrc.js')] : [];

const config = {
  input,
  output,
  exports: esm ? 'named' : 'default',
  external: externalDependencies,
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
    })
  ].filter(Boolean)
};

export default config;
