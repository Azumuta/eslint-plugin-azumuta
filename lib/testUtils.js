import babelParser                      from '@babel/eslint-parser';
import typeScriptParser                 from '@typescript-eslint/parser';
import { RuleTester }                   from 'eslint';


const DEFAULT_TEST_CASE_CONFIG = {
    filename: 'MyComponent.test.js',
};

class TestingLibraryRuleTester extends RuleTester {
    run(
        ruleName,
        rule,
        tests,
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

export function createRuleTester(
    parserOptions = {},
    isTypescript = false,
) {
    return new TestingLibraryRuleTester({
        languageOptions: {
            parser: isTypescript
                ? typeScriptParser
                : babelParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                ...parserOptions,
            },
        },
    });
}
