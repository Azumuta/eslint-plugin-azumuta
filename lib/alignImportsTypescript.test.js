const { createRuleTester } = require('./testUtils');
const ruleTester = createRuleTester({}, true);
const rule = require('./rules/align-imports');

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