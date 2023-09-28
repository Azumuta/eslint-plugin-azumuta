const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester();
const rule = require('./rules/align-imports');

ruleTester.run('AlignImports', rule, {
    valid: [
        // Test Cases for Imports (TODO also align when there are only aligns)
        /*{
            code: `
            import { expect } from 'chai';
            import { Action, State } from 'common/api/exportImport/importContext';
      `,
            options: [2, 45],
            errors: [{
                suggestions: [{ output: 'abc' }],
            }],
            output: 'abc'
        },*/

    ],
    invalid: [
        // Test Cases for Imports (TODO also handle this case)
        /*{
            code: `
            import { expect } from 'chai';
            import { Action, State } from 'common/api/exportImport/importContext';
            let d;
      `,
            options: [45],
            errors: [{
                line: 2,
            }],
            output:
                `
import { expect }                       from 'chai';
import { Action, State }                from 'common/api/exportImport/importContext';
            let d;
      `
        },*/
        // Test Cases for Imports
        {
            code: `
import { expect } from 'chai';
import { Action, State } from 'common/api/exportImport/importContext';
let d;`,
            errors: [{ line: 2, }],
            output:
                `
import { expect }                       from 'chai';
import { Action, State }                from 'common/api/exportImport/importContext';
let d;`
        },
        {
            code: `
import os from 'os';
import { expect } from 'chai';
let d;`,
            errors: [{ line: 2, }],
            output:
                `
import os                               from 'os';
import { expect }                       from 'chai';
let d;`
        },
    ]
});