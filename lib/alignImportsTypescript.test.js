import { createRuleTester }            from './testUtils.js';
import rule, { ALIGN_IMPORTS_MESSAGE } from './rules/align-imports.js';


const ruleTester = createRuleTester({}, true);
ruleTester.run('AlignImportsTypescript', rule, {
    valid: [
        {
            code:
                `
import type { Parameters }              from '/imports/rest/v1/reporting/getRecordingAnswers';`,
        },
        {
            code:
                `
import type { Parameters, Parans, Pas } from '/imports/rest/v1/reporting/getRecordingAnswers';`,
        },
        {
            code:
                `
import type {
    Parameters,
    Parans,
    Pasa,
}                                       from '/imports/rest/v1/reporting/getRecordingAnswers';`,
        },
    ],
    invalid: [
        {
            code:
                `
import type { Parameters }          from '/imports/rest/v1/reporting/getRecordingAnswers';`,
            errors: [{
                message: ALIGN_IMPORTS_MESSAGE,
                line: 2,
            }],
            output:
                `
import type { Parameters }              from '/imports/rest/v1/reporting/getRecordingAnswers';`
        },
        {
            code:
                `
import type {
    Parameters,
    Params, 
    Pas,
}                                       from '/imports/rest/v1/reporting/getRecordingAnswers';`,
            errors: [{
                message: ALIGN_IMPORTS_MESSAGE,
                line: 2,
            }],
            output:
                `
import type { Parameters, Params, Pas } from '/imports/rest/v1/reporting/getRecordingAnswers';`,
        },
        {
            code:
                `
import type {
    Parameters,
    Parans,
    Pasa,
}    from '/imports/rest/v1/reporting/getRecordingAnswers';`,
            errors: [{
                message: ALIGN_IMPORTS_MESSAGE,
                line: 2,
            }],
            output:
                `
import type {
    Parameters,
    Parans,
    Pasa,
}                                       from '/imports/rest/v1/reporting/getRecordingAnswers';`,
        },
    ]
});