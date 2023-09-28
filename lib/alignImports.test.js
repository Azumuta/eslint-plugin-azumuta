const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester();
const rule = require('./rules/align-imports');

ruleTester.run('AlignImports', rule, {
    valid: [
        // Test Cases for Imports
        {
            code: `
            import { expect } from 'chai';
            import { Action, State } from 'common/api/exportImport/importContext';
      `,
        },
    ],
    invalid: []
});