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
        {
            code: `
import {
  a, 
}              from 'somefile';`,
            errors: [{ line: 2, }],
            output:
                `
import {
    a,
}                                       from 'somefile';`
        },
        {
            code: `
import 
  a 
              from 'somefile';`,
            errors: [{ line: 2, }],
            output:
                `
import {
    default as a,
}                                       from 'somefile';`
        },
        {
            code: `
import { Action } from 'common/api/exportImport/importContext';`,
            errors: [{ line: 2, }],
            output:
                `
import { Action }                       from 'common/api/exportImport/importContext';`
        },
        {
            code: `
import { expect }                       from 'chai';
import Balances, { Balance }            from '/imports/api/balances';
import {
    createWorkinstruction,
    originalCompany,
    setupMain,
    workinstructionToString,
    approve,
    getCreateWorkInstructionArgs,
    exportWorkinstruction, selectCompany,
    destinationCompany, actualImportWorkinstruction,
    rootNodeId,
    addWorkinstruction,
    getDefaultContext,
    importWorkinstruction,
    getImportContext,
}                                       from '/imports/api/workinstructions/server/export-import/importExportTestUtility';
import { findRequiredBalance } from '/imports/api/workinstructions/server/export-import/importUtility';
import uuid_v4 from '/imports/libs/uuid_v4';
import { getMasterBalance } from '/imports/rest/v1/workinstructions/util';
import { Action } from 'common/api/exportImport/importContext';
import {
    JumpToTarget,
    Rule,
    RuleType,
} from 'common/api/rules';`,
            errors: [{ line: 2, }],
            output:
                `
import { expect }                       from 'chai';
import Balances, { Balance }            from '/imports/api/balances';
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
}                                       from '/imports/api/workinstructions/server/export-import/importExportTestUtility';
import { findRequiredBalance }          from '/imports/api/workinstructions/server/export-import/importUtility';
import uuid_v4                          from '/imports/libs/uuid_v4';
import { getMasterBalance }             from '/imports/rest/v1/workinstructions/util';
import { Action }                       from 'common/api/exportImport/importContext';
import {
    JumpToTarget,
    Rule,
    RuleType,
}                                       from 'common/api/rules';`
        },
    ]
});