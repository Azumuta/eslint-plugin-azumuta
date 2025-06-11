import azumutaSortImports  from './rules/sort-imports.js';
import azumutaAlignImports from './rules/align-imports.js';
import parser              from '@babel/eslint-parser';
import importPlugin        from 'eslint-plugin-import';
import { Linter }          from 'eslint';
import { expect }          from 'chai';


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
const importOrderConfig = ["error", {
    "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
    "newlines-between": "never"
}];

const defaultConfig = {
    languageOptions: {
        parser: parser,
    },
    rules: {
        'AzumutaAlignImports': azumutaAlignImports,
        'AzumutaSortImports': azumutaSortImports,
        'ImportOrder': importPlugin.rules['order'],
    }
}

describe('Sort and align combined', () => {
    function createLinter() {
        const linter = new Linter();
        return linter;
    }

    function expectForRun(expectedCode, inputCode) {
        const messages = createLinter().verifyAndFix(inputCode, {
            languageOptions: {
                parser: parser,
            },
            plugins: {
                local: {
                    rules: {
                        AzumutaAlignImports: azumutaAlignImports,
                        AzumutaSortImports: azumutaSortImports,
                        ImportOrder: importPlugin.rules['order'],
                    }
                },
            },
            rules: {
                'local/AzumutaAlignImports': [1, 45],
                'local/AzumutaSortImports': [1, ...options],
                'local/ImportOrder': importOrderConfig,
            },
        }, 'someFileName.js');
        expect(messages.output).equal(expectedCode);
    }

    it('combo', async() => {
        await expectForRun(
            `
import { expect }                       from 'chai';
import { Action, State }                from 'common/api/exportImport/importContext';
let d;`,
            `
import { Action, State } from 'common/api/exportImport/importContext';
import { expect } from 'chai';
let d;`);
    });
    it('include os', async() => {
        await expectForRun(
            `
import os                               from 'os';
import { expect }                       from 'chai';
let d;`,
            `
import os from 'os';
import { expect } from 'chai';
let d;`);
    });
    it('include os and common', async() => {
        await expectForRun(
            `
import os                               from 'os';
import { expect }                       from 'chai';
import { Action, State }                from 'common/api/exportImport/importContext';
let d;`,
            `
import { Action, State } from 'common/api/exportImport/importContext';
import { expect } from 'chai';
import os from 'os';
let d;`);
    });
});