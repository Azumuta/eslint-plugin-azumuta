const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester();
const rule = require('./rules/sort-imports');

const options = [[
    [0, "react"],
    [6, "@fortawesome/react-fontawesome"],
    [7, "start", "@fortawesome"],
    [2, "meteor/meteor"],
    [2, "react-native"],
    [3, "contain", "react-native"],
    [3, "start", "meteor/"],
    [1, "contain", "react-"],
    [1, "prop-types"],
    [5, "*"],
    [10, "start", "/imports/api/"],
    [11, "start", "/imports/ui/"],
    [12, "start", "/imports/"],
    [20, "start", "/"],
    [25, "start", "cobalt-core/"],
    [26, "start", "common/"],
    [30, "start", "."]
]];

ruleTester.run('SortImports', rule, {
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
        {
            code: `
import { Action, State } from 'common/api/exportImport/importContext';
import { expect } from 'chai';
let d;`,
            errors: [{ line: 2, }],
            options,
            output:
                `
import { expect } from 'chai';
import { Action, State } from 'common/api/exportImport/importContext';
let d;`
        },
        {
            code: `
import os from 'os';
import { expect } from 'chai';
let d;`,
            errors: [{ line: 2, }],
            options,
            output:
                `
import { expect } from 'chai';
import os from 'os';
let d;`
        },
        {
            code: `
import { Action, State } from 'common/api/exportImport/importContext';
import { expect } from 'chai';
import os from 'os';
let d;`,
            errors: [{ line: 2, }],
            options,
            output:
                `
import { expect } from 'chai';
import os from 'os';
import { Action, State } from 'common/api/exportImport/importContext';
let d;`
        },
    ]
});