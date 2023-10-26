const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester();
const rule = require('./rules/align-imports');

ruleTester.run('AlignImports', rule, {
    valid: [
    ],
    invalid: [
        {
            code: `
import functionWithVeryLongNameWhichSometimesHappensInPracticeEnAl from '/imports/api/instructions/photoPages/utils';
let d;`,
            options: [45],
            errors: [{
                line: 2,
            }],
            output:
                `
import {
    default as functionWithVeryLongNameWhichSometimesHappensInPracticeEnAl,
}                                       from '/imports/api/instructions/photoPages/utils';
let d;`
        },
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
        {
            code: `
import { expect } from 'chai';`,
            errors: [{ line: 2, }],
            output:
                `
import { expect }                       from 'chai';`
        },
        {
            code: `
import {
    createWorkinstruction,
    originalCompany, setupMain,
    workinstructionToString, approve, getCreateWorkInstructionArgs, exportWorkinstruction, selectCompany, destinationCompany, actualImportWorkinstruction, rootNodeId, addWorkinstruction, getDefaultContext, importWorkinstruction, getImportContext,
}                                       from '/imports/api/workinstructions/server/export-import/importExportTestUtility';`,
            errors: [{ line: 2, }],
            output:
                `
import {
    createWorkinstruction,
    originalCompany,
    setupMain,
    workinstructionToString,
    approve,
    getCreateWorkInstructionArgs,
    exportWorkinstruction,
    selectCompany,
    destinationCompany,
    actualImportWorkinstruction,
    rootNodeId,
    addWorkinstruction,
    getDefaultContext,
    importWorkinstruction,
    getImportContext,
}                                       from '/imports/api/workinstructions/server/export-import/importExportTestUtility';`
        },
        {
            code: `
import {
    createWorkinstruction, originalCompany, setupMain,
    workinstructionToString, approve, getCreateWorkInstructionArgs, exportWorkinstruction, selectCompany, destinationCompany, actualImportWorkinstruction, rootNodeId, addWorkinstruction, getDefaultContext, importWorkinstruction, getImportContext,
}              from '/imports/api/workinstructions/server/export-import/importExportTestUtility';`,
            errors: [{ line: 2, }],
            output:
                `
import {
    createWorkinstruction,
    originalCompany,
    setupMain,
    workinstructionToString,
    approve,
    getCreateWorkInstructionArgs,
    exportWorkinstruction,
    selectCompany,
    destinationCompany,
    actualImportWorkinstruction,
    rootNodeId,
    addWorkinstruction,
    getDefaultContext,
    importWorkinstruction,
    getImportContext,
}                                       from '/imports/api/workinstructions/server/export-import/importExportTestUtility';`
        },
    ]
});