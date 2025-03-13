import sortImports          from './rules/sort-imports.js';
import forceAbsoluteImports from './rules/force-absolute-imports.js';
import alignImports         from './rules/align-imports.js';


const plugin = {
    meta: {
        name: 'eslint-plugin-azumuta',
        version: '0.0.14',
    },
    configs: {},
    rules: {
        'align-imports': alignImports,
        'force-absolute-imports': forceAbsoluteImports,
        'sort-imports': sortImports,
    },
    processors: {},
};

export default plugin;
