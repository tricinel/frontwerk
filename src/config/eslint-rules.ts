import { hasAllDeps } from '../utils/hasDep';

const hasReact = hasAllDeps<boolean>(['react'], true);
const hasTypeScript = hasAllDeps<boolean>(['typescript'], true);

interface ESLintRuleConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

type ESLintRuleOptions = [string, ESLintRuleConfig];

interface ESLintSimpleRule {
  [k: string]: string | number;
}

interface ESLintRuleWithOptions {
  [k: string]: ESLintRuleOptions;
}

type ESLintRule = ESLintSimpleRule | ESLintRuleWithOptions;

const additionalRules: ESLintRule[] = [];

if (hasReact) {
  // 'react/jsx-filename-extension': ['error', { extensions: [] }]
  const key = 'react/jsx-filename-extension';
  const rule: ESLintRule = {
    [key]: ['error', { extensions: ['.jsx'] }]
  };

  if (hasTypeScript) {
    rule[key][1].extensions.concat(['.ts', '.tsx']);
  }

  additionalRules.concat([rule]);
}

const rules = {
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: true
    }
  ],
  ...additionalRules
};

export default rules;
