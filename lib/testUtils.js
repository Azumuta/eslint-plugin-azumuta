const { resolve } = require('path');
const { RuleTester } = require('eslint');

const DEFAULT_TEST_CASE_CONFIG = {
    filename: 'MyComponent.test.js',
};

class TestingLibraryRuleTester extends RuleTester {
    run(
        ruleName,
        rule,
        tests
    ) {
        const { valid, invalid } = tests;

        const finalValid = valid.map((testCase) => {
            if (typeof testCase === 'string') {
                return {
                    ...DEFAULT_TEST_CASE_CONFIG,
                    code: testCase,
                };
            }

            return { ...DEFAULT_TEST_CASE_CONFIG, ...testCase };
        });
        const finalInvalid = invalid.map((testCase) => ({
            ...DEFAULT_TEST_CASE_CONFIG,
            ...testCase,
        }));

        super.run(ruleName, rule, { valid: finalValid, invalid: finalInvalid });
    }
}

exports.createRuleTester = (
    parserOptions = {},
    isTypescript = false,
) => {
    return new TestingLibraryRuleTester({
        parser: isTypescript ? resolve('./node_modules/@typescript-eslint/parser/dist') : resolve('./node_modules/@babel/eslint-parser'),
        parserOptions: {
            ecmaVersion: 2018,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true,
            },
            babelOptions: {
                parserOpts: {
                    plugins: ['importAssertions'],
                },
            },
            ...parserOptions,
        },
    });
};