export interface Script {
  name: string;
  desc: string;
  opts?: string;
}

export interface Docs {
  availableScripts: Script[];
}

const docs = {
  availableScripts: [
    {
      name: 'build --bundle',
      desc: 'Build your ES6 files into a single file using RollupJS',
      opts:
        'You can override the defaults by either passing your --config or defining a rollup.config.js file. All other rollup flags are supported.'
    },
    {
      name: 'build',
      desc: 'Build your ES6 files using BabelJS',
      opts:
        'You can override the defaults by either passing your --presets, defining a .babelrc file or having a babel property in your package.json. All other babel flags are supported.'
    },
    {
      name: 'lint',
      desc: 'Lint your JS files using ESLint',
      opts:
        'You can override the defaults by either passing your --config, defining a .eslintrc/eslintrc.js file or having a eslintConfig property in your package.json. All other eslint flags are supported.'
    },
    {
      name: 'stylelint',
      desc: 'Lint your CSS/SCSS/SASS files using Stylelint',
      opts:
        'You can override the defaults by either passing your --config, defining a .stylelintrc/stylelint.config.js file or having a stylelint property in your package.json. All other stylelint flags are supported.'
    },
    {
      name: 'format',
      desc: 'Format your JS files using Prettier',
      opts:
        'You can override the defaults by either passing your --config, defining a .prettierrc/prettier.config.js file or having a prettierrc property in your package.json. All other Prettier flags are supported.'
    },
    {
      name: 'test',
      desc: 'Test your JS files using Jest',
      opts:
        'You can override the defaults by either passing your --config or having a jes property in your package.json. All other Jest flags are supported.'
    }
  ]
};

export default docs;
