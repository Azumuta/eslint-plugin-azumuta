const DEFAULT_SOURCE_START_COLUMN = 45;
const TAB_INDENT = 4;
const spacingRegex = /[^\s](\s)+}/;
const splitRegex = /([,{}]\s*)/g;

// Get whitespace length before last curly brace of import statement;
// >> import { Meteor   } from 'meteor';
//                  >---<
function getWhitespace(statement) {
    let match = statement.match(spacingRegex);
    if (match) {
        return (match[0].length - 2) + 1;
    }
    return 1;
}
const longRegEx = /^import\s+(.*)\s+from\s+(.*);$/
const importWithCurlyBracketsPart = /^import\s*{\s*(?<elements>.*)\s*}\s+from\s+(?<file>.*);$/gs;
function splitSpecifiers(line, expectedFromPosition) {
    if (line.indexOf('{') === -1) {
        const result = longRegEx.exec(line);
        // length 3 means there's a match (0 is the whole string, 1 is the first group, 2 is the second group)
        if (result?.length === 3) {
            return `import {\n${' '.repeat(TAB_INDENT)}default as ${result[1]},\n}${' '.repeat(expectedFromPosition - 1)}from ${result[2]};`;
        }
    }
    // reset global regex
    importWithCurlyBracketsPart.lastIndex = 0;
    const resultPart1 = importWithCurlyBracketsPart.exec(line);
    const elements = resultPart1?.groups?.elements;
    const file = resultPart1?.groups?.file;
    if (elements && file) {
        const parts = elements.split(/[,\s]+/g).filter(p => p);
        // TODO check if we want to sort
        //parts.sort();
        return `import {\n${parts.map((p) => ' '.repeat(TAB_INDENT) + p).join(',\n')},\n}${' '.repeat(expectedFromPosition - 1)}from ${file};`;
    }
}

function importFixer(imports, sourceStartColumns, newSourceStartColumn, sourceCode) {

    let isMultiLine = imports.map(decl => decl.loc.start.line !== decl.loc.end.line);
    let hasFrom = imports.map(decl => decl.specifiers.length > 0);

    // First column ends after specifiers or after import if no specifiers
    let firstColumnEnds = imports.map((decl, i) => {
        if (hasFrom[i]) {
            if (isMultiLine[i]) {
                let lastLineSource = sourceCode.lines[decl.loc.end.line - 1];
                return lastLineSource.indexOf('}') + 1;
            } else {
                let lastSpecifier = decl.specifiers[decl.specifiers.length - 1];
                let start = lastSpecifier.loc.end.column;

                return start
                    + (lastSpecifier.type === 'ImportSpecifier' ? getWhitespace(sourceCode.getText(decl)) : 0);
            }
        } else {
            return 'import'.length;
        }
    });

    // Second column starts before from or before source if no specifiers
    let secondColumnStarts = sourceStartColumns.map((oldValue, i) => {
        if (hasFrom[i]) {
            oldValue -= 'from '.length;
        }
        return oldValue;
    });

    // Spacing between first column end and second column start should change this much
    let deltas = sourceStartColumns.map(col => newSourceStartColumn - col);

    //console.log('Is multiline       ', isMultiLine);
    //console.log('First column end   ', firstColumnEnds);
    //console.log('Second column start', secondColumnStarts);


    return function* (fixer) {
        for (let i = 0; i < imports.length; i++) {
            let decl = imports[i];

            const expectedFromPosition = newSourceStartColumn - 'from '.length;
            // Split specifiers on different lines
            if (firstColumnEnds[i] >= expectedFromPosition || isMultiLine[i]) {
                let declText = sourceCode.getText(decl);
                let newText = splitSpecifiers(declText, expectedFromPosition);
                // Rule will rerun if alignment becomes incorrect
                yield fixer.replaceTextRange(decl.range, newText);
                return;
            }

            let lineStart = isMultiLine[i] ?
                sourceCode.getIndexFromLoc({ line: decl.loc.end.line, column: 0 })
                : decl.range[0];

            let oldSize = secondColumnStarts[i] - firstColumnEnds[i];
            let newSize = oldSize + deltas[i];

            let oldRange = [
                lineStart + firstColumnEnds[i],
                lineStart + secondColumnStarts[i]
            ];

            yield fixer.replaceTextRange(oldRange, ' '.repeat(newSize));
        }
    }

}


module.exports = {
    meta: {
        docs: {
            description: 'Align \'from\' parts of imports',
            recommended: true,
        },
        fixable: "whitespace",
        schema: [
            {
                type: 'integer'
            }
        ]
    },

    create: function (context) {
        const newSourceStartColumn = (context.options.length && context.options[0]) || DEFAULT_SOURCE_START_COLUMN;
        let imports = [];
        let done = false;

        function importsDone() {

            const sourceStartColumns = imports.map(decl => decl.source.loc.start.column);
            const hasUnalignedSpecifiers = imports.filter(decl =>
                decl.specifiers.length > 1 &&
                decl.specifiers.find(specifier => specifier.loc.start.column != TAB_INDENT)
            ).length > 0;

            if (!sourceStartColumns.every((col, i) => col === newSourceStartColumn) || hasUnalignedSpecifiers) {
                context.report({
                    node: imports[0],
                    message: 'Imports not aligned correctly',
                    fix: importFixer(imports, sourceStartColumns, newSourceStartColumn, context.getSourceCode())
                });
            }
        }

        return {
            'ImportDeclaration': function (node) {
                imports.push(node);
            },
            // Selector 'ImportDeclaration + :not(ImportDeclaration)' gives an error
            ':not(ImportDeclaration):not(ImportDeclaration *)': function (node) {
                if (!done && imports.length >= 1) {
                    done = true;
                    importsDone();
                }
            },
            "Program:exit"(node) {
                // special case when there are no other statements
                if (!done && imports.length >= 1) {
                    done = true;
                    importsDone();
                }
            }
        };
    },
};
