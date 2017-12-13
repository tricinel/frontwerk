module.exports = {
  ignore: ['<PROJECT_ROOT>/node_modules/.*', '<PROJECT_ROOT>/dist/.*'],
  include: [],
  libs: [],
  options: [
    'esproposal.class_static_fields=enable',
    'esproposal.class_instance_fields=enable',
    'unsafe.enable_getters_and_setters=true',
    'munge_underscores=false',
    'suppress_type=$FlowFixMe',
    'suppress_type=$FlowExpectedError',
    'suppress_comment=\\(.\\|\n\\)*\\$FlowFixMe\\($\\|[^(]\\|(\\(>=0\\.\\(3[0-3]\\|[1-2][0-9]\\|[0-9]\\).[0-9]\\)? *\\(site=[a-z,_]*www[a-z,_]*\\)?)\\)',
    'suppress_comment=\\(.\\|\n\\)*\\$FlowExpectedError'
  ]
};
