const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester();
const rule = require('./rules/align-imports');

ruleTester.run('AlignImports', rule, {
    valid: [
        /* don't modify what can stay on one line */
        {
            code: `
import Balances, { Balance }            from '/imports/api/balances';`,
        },
        /* don't modify what can't stay on one line (corner case) */
        {
            code: `
import {
    JumpToTarget,
    Rule,
    RuleType2,
} from 'common/api/rules';`,
        },
        /* don't modify what can't stay on one line (corner case, with default) */
        {
            code: `
import JumpToTarget, {
    Rule,
    RuleType2,
} from 'common/api/rules';`,
        },
        /* don't modify what can stay on one line (corner case) */
        {
            code: `
import { JumpToTarget, Rule, RuleType } from 'common/api/rules';`,
        },
        /* don't modify what can stay on one line (corner case, with default) */
        {
            code: `
import JumpToTarget, { Rule, RuleType } from 'common/api/rules';`,
        },
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
    actualImportWorkinstruction,
    addWorkinstruction,
    approve,
    createWorkinstruction,
    destinationCompany,
    exportWorkinstruction,
    getCreateWorkInstructionArgs,
    getDefaultContext,
    getImportContext,
    importWorkinstruction,
    originalCompany,
    rootNodeId,
    selectCompany,
    setupMain,
    workinstructionToString,
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
    actualImportWorkinstruction,
    addWorkinstruction,
    approve,
    createWorkinstruction,
    destinationCompany,
    exportWorkinstruction,
    getCreateWorkInstructionArgs,
    getDefaultContext,
    getImportContext,
    importWorkinstruction,
    originalCompany,
    rootNodeId,
    selectCompany,
    setupMain,
    workinstructionToString,
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
import { a }                            from 'somefile';`
        },
        {
            code: `
import 
  a 
              from 'somefile';`,
            errors: [{ line: 2, }],
            output:
                `
import a                                from 'somefile';`
        },
        {
            code: `
import React,
{
    useMemo,
    useEffect,
    useRef,
}                                       from 'react';`,
            errors: [{ line: 2, }],
            output:
                `
import React, {
    useEffect,
    useMemo,
    useRef,
}                                       from 'react';`
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
    actualImportWorkinstruction,
    addWorkinstruction,
    approve,
    createWorkinstruction,
    destinationCompany,
    exportWorkinstruction,
    getCreateWorkInstructionArgs,
    getDefaultContext,
    getImportContext,
    importWorkinstruction,
    originalCompany,
    rootNodeId,
    selectCompany,
    setupMain,
    workinstructionToString,
}                                       from '/imports/api/workinstructions/server/export-import/importExportTestUtility';
import { findRequiredBalance }          from '/imports/api/workinstructions/server/export-import/importUtility';
import uuid_v4                          from '/imports/libs/uuid_v4';
import { getMasterBalance }             from '/imports/rest/v1/workinstructions/util';
import { Action }                       from 'common/api/exportImport/importContext';
import { JumpToTarget, Rule, RuleType } from 'common/api/rules';`
        },
        {
            code: `
import {
    JumpToTarget,
    Rule,
    RuleType,
} from 'common/api/rules';`,
            errors: [{ line: 2, }],
            output:
                `
import { JumpToTarget, Rule, RuleType } from 'common/api/rules';`
        },
    ]
});