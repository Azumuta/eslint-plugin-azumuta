const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester();
const rule = require('./rules/align-imports');

ruleTester.run('AlignImports', rule, {
    valid: [
        {
            code: `
import                                       '/imports/api/balances';`,
        },
        {
            code: `
import                                       '/imports/api/treeNodes/tests/renameNodesFromReference.meteor-test';
import                                       '/imports/api/treeNodes/tests/pasteTreeNode.meteor-test';
import                                       '/imports/api/treeNodes/tests/cloneTreeNode.meteor-test';
import                                       '/imports/api/users/tests/ensureCanManageUser.meteor-test';
import                                       '/imports/api/properties/values/static.resolveRawPropertyValue.meteor-test';
import                                       '/imports/api/properties/values/static.validatePropertyValues.meteor-test';
import                                       '/imports/api/properties/values/static.alignPropertyValuesToOptions.meteor-test';
import                                       '/imports/api/workinstructions/bundle/static.getWorkinstructionBundle.meteor-test';
import                                       '/imports/api/workinstructions/bundle/static.bundleBalanceWorker.meteor-test';
import                                       '/imports/api/workinstructions/bundle/static.bundleResources.meteor-test';
import                                       '/imports/api/workinstructions/server/copyWorkinstruction.meteor-test';`
        },
        // don't modify what can stay on one line
        {
            code: `
import Balances, { Balance }            from '/imports/api/balances';`,
        },
        // don't modify what can't stay on one line (corner case)
        {
            code: `
import {
    JumpToTarget,
    Rule,
    RuleType2,
}                                       from 'common/api/rules';`,
        },
        // don't modify what can't stay on one line (corner case, with default)
        {
            code: `
import JumpToTarget, {
    Rule,
    RuleType2,
}                                       from 'common/api/rules';`,
        },
        // don't modify what can stay on one line (corner case)
        {
            code: `
import { JumpToTarget, Rule, RuleType } from 'common/api/rules';`,
        },
        // don't modify what can stay on one line (one spare character)
        {
            code: `
import { JumpToTarget, Rule, RuleTyp }  from 'common/api/rules';`,
        },
        // don't modify what can stay on one line (corner case, with default)
        {
            code: `
import JumpToTarget, { Rule, RuleType } from 'common/api/rules';`,
        },
        // don't modify sorting single line (without default)
        {
            code:
                `
import { a, b, c }                      from 'd';`
        },
        // don't modify sorting single line (with default)
        {
            code:
                `
import Deft, { a, b, c }                from 'd';`
        },
        // don't modify sorting multi line (without default)
        {
            code:
                `
import {
    aItemLonger1,
    bItemLonger1,
    cItemLonger1,
}                                       from 'd';`
        }, ,
        // don't modify sorting multi line (with default)
        {
            code:
                `
import Deft, {
    aItemLonger1,
    bItemLonger1,
    cItemLonger1,
}                                       from 'd';`
        },
        {
            code:
                `
import * as security                    from '/imports/api/security';`
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsdfsdfsdf from '/imports/api/security';`,
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsda from '/imports/api/security';`,
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsd  from '/imports/api/security';`,
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsdab from '/imports/api/security';`,
        },
        // don't modify correctly sorted (ignoring cases)
        {
            code: `
import { Bup, aLowercase, cLow }        from 'common/api/rules';`,
        },
        {
            code:
                `
import {
    BupLonger,
    aLowercaseLonger,
    cLowLonger,
}                                       from 'common/api/rules';`
        },
        // test sorting single line (without default)
        {
            code: `
import {c, b, a}                        from 'd';`,
        },
        // test sorting single line (with default)
        {
            code: `
import Deft, {c, b, a}                  from 'd';`,
        },
        // test sorting multi line (without default)
        {
            code: `
import {
    cItemLonger1,
    bItemLonger1,
    aItemLonger1,
}                                       from 'd';`,
        }, ,
        // test sorting multi line (with default)
        {
            code: `
import Deft, {
    cItemLonger1,
    bItemLonger1,
    aItemLonger1,
}                                       from 'd';`,
        },
        // sort case-sensitively
        {
            code: `
import { aLowercase, Bup, cLow }        from 'common/api/rules';`,
        },
        // sort case-sensitively longer imports
        {
            code: `
import {
    aLowercaseLonger,
    BupLonger,
    cLowLonger
}                                       from 'common/api/rules';`,
        },
        {
            code: `
import                                       './common/api/rules';
import * as rules                       from './common/api/rules';
import { aLowercase, Bup, cLow }        from './common/api/rules';`,
        },
        {
            code: `
import AtlasCopcoPF6000OpenProtocolPlug from '.';`,
        },
        {
            code: `
import MID_GROUPS                       from 'node-open-protocol/src/midGroups.json' assert { type: 'json' };`,
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
    useMemo,
    useEffect,
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
        // don't modify what can stay on one line (one spare character)
        {
            code: `
import {
    JumpToTarget,
    Rule,
    RuleTyp,
} from 'common/api/rules';`,
            errors: [{ line: 2, }],
            output: `
import { JumpToTarget, Rule, RuleTyp }  from 'common/api/rules';`,
        },
        {
            code:
                `
import * as security                  from '/imports/api/security';`,
            errors: [{ line: 2, }],
            output:
                `
import * as security                    from '/imports/api/security';`
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsda        from '/imports/api/security';`,
            errors: [{ line: 2, }],
            output:
                `
import * as securityVeryLonsdfsdfdsfsda from '/imports/api/security';`
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsd from '/imports/api/security';`,
            errors: [{ line: 2, }],
            output:
                `
import * as securityVeryLonsdfsdfdsfsd  from '/imports/api/security';`
        },
        {
            code:
                `
import * as securityVeryLonsdfsdfdsfsdab     from '/imports/api/security';`,
            errors: [{ line: 2, }],
            output:
                `
import * as securityVeryLonsdfsdfdsfsdab from '/imports/api/security';`
        },
        {
            code:
                `
import {
    exportWorkinstructionWithVersion,
} from '/imports/api/workinstructions/server/export-import/export';`,
            errors: [{ line: 2, }],
            output:
                `
import {
    exportWorkinstructionWithVersion,
}                                       from '/imports/api/workinstructions/server/export-import/export';`
        },
        {
            code: `
import '/imports/api/treeNodes/tests/renameNodesFromReference.meteor-test';
import '/imports/api/treeNodes/tests/pasteTreeNode.meteor-test';
import '/imports/api/treeNodes/tests/cloneTreeNode.meteor-test';
import '/imports/api/users/tests/ensureCanManageUser.meteor-test';
import '/imports/api/properties/values/static.resolveRawPropertyValue.meteor-test';
import '/imports/api/properties/values/static.validatePropertyValues.meteor-test';
import '/imports/api/properties/values/static.alignPropertyValuesToOptions.meteor-test';
import '/imports/api/workinstructions/bundle/static.getWorkinstructionBundle.meteor-test';
import '/imports/api/workinstructions/bundle/static.bundleBalanceWorker.meteor-test';
import '/imports/api/workinstructions/bundle/static.bundleResources.meteor-test';
import '/imports/api/workinstructions/server/copyWorkinstruction.meteor-test';`,
            errors: [{ line: 2, }],
            output: `
import                                       '/imports/api/treeNodes/tests/renameNodesFromReference.meteor-test';
import                                       '/imports/api/treeNodes/tests/pasteTreeNode.meteor-test';
import                                       '/imports/api/treeNodes/tests/cloneTreeNode.meteor-test';
import                                       '/imports/api/users/tests/ensureCanManageUser.meteor-test';
import                                       '/imports/api/properties/values/static.resolveRawPropertyValue.meteor-test';
import                                       '/imports/api/properties/values/static.validatePropertyValues.meteor-test';
import                                       '/imports/api/properties/values/static.alignPropertyValuesToOptions.meteor-test';
import                                       '/imports/api/workinstructions/bundle/static.getWorkinstructionBundle.meteor-test';
import                                       '/imports/api/workinstructions/bundle/static.bundleBalanceWorker.meteor-test';
import                                       '/imports/api/workinstructions/bundle/static.bundleResources.meteor-test';
import                                       '/imports/api/workinstructions/server/copyWorkinstruction.meteor-test';`
        },
        {
            code: `
import                                     './common/api/rules';
import * as rules                     from './common/api/rules';
import { aLowercase, Bup, cLow }      from './common/api/rules';`,
            errors: [{ line: 2, }],
            output: `
import                                       './common/api/rules';
import * as rules                       from './common/api/rules';
import { aLowercase, Bup, cLow }        from './common/api/rules';`
        },
        {
            code: `
import AtlasCopcoPF6000OpenProtocolPlugin from '.';`,
            errors: [{ line: 2, }],
            output: `
import {
    default as AtlasCopcoPF6000OpenProtocolPlugin,
}                                       from '.';`
        },
        {
            code: `
import AtlasCopcoPF6000OpenProtocolPlugi from '.';`,
            errors: [{ line: 2, }],
            output: `
import {
    default as AtlasCopcoPF6000OpenProtocolPlugi,
}                                       from '.';`
        },
        {
            code: `
import MID_GROUPS from 'node-open-protocol/src/midGroups.json' assert { type: 'json' };`,
            errors: [{ line: 2, }],
            output: `
import MID_GROUPS                       from 'node-open-protocol/src/midGroups.json' assert { type: 'json' };`
        },
    ]
});