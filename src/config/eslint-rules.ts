import { hasDep } from '../utils/hasDep';

const hasReact = hasDep('react');
const hasTypeScript = hasDep('typescript');

interface ESLintRuleConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}

type ESLintRuleOptions = [string, ESLintRuleConfig];

interface ESLintSimpleRules {
  [k: string]: string | number;
}

interface ESLintRulesWithOptions {
  [k: string]: ESLintRuleOptions;
}

type ESLintRules = ESLintSimpleRules | ESLintRulesWithOptions;

const additionalRules: ESLintRules = {};

if (hasReact) {
  const rule: ESLintRuleOptions = ['error', { extensions: ['.jsx'] }];

  if (hasTypeScript) {
    rule[1].extensions = [...rule[1].extensions, '.ts', '.tsx'];
  }

  additionalRules['react/jsx-filename-extension'] = rule;
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
