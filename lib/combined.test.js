const sortImports = require('./rules/sort-imports');
const alignImports = require('./rules/align-imports');
const parser = require('@babel/eslint-parser');
const { Linter } = require('eslint');
const { expect } = require('chai');

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

describe('Sort and align combined', () => {
    let linter;
    function createLinter() {
        linter = new Linter();
        linter.defineRule('AlignImports', alignImports);
        linter.defineRule('SortImports', sortImports);
        linter.defineParser('BabelParser', parser);
        return linter;
    }
    function expectForRun(expectedCode, inputCode) {
        const messages = createLinter().verifyAndFix(inputCode, {
            parser: 'BabelParser',
            rules: {
                AlignImports: [1, 45],
                SortImports: [1, ...options],
            }
        }, 'someFileName.js');
        expect(messages.output).equal(expectedCode);
    }
    it('combo', () => {
        expectForRun(
            `
import { expect }                       from 'chai';
import { Action, State }                from 'common/api/exportImport/importContext';
let d;`,
            `
import { Action, State } from 'common/api/exportImport/importContext';
import { expect } from 'chai';
let d;`);
    });
    it('include os', () => {
        expectForRun(
            `
import { expect }                       from 'chai';
import os                               from 'os';
let d;`,
            `
import os from 'os';
import { expect } from 'chai';
let d;`);
    });
    it('include os and common', () => {
        expectForRun(
            `
import { expect }                       from 'chai';
import os                               from 'os';
import { Action, State }                from 'common/api/exportImport/importContext';
let d;`,
            `
import { Action, State } from 'common/api/exportImport/importContext';
import { expect } from 'chai';
import os from 'os';
let d;`);
    });
});