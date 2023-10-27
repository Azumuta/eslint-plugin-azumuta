const DEFAULT_SOURCE_START_COLUMN = 45;
const TAB_INDENT = 4;

function generateImportText(currentImport, defaultSpecifierText, importNamespaceSpecifierText,
    specifierTexts, newSourceStartColumn, isMultiLine) {
    let newLine = 'import ';
    if (currentImport.importKind && currentImport.importKind === 'type') {
        newLine += 'type ';
    }
    // when there's an import namespace, we'll only have that
    if (importNamespaceSpecifierText) {
        newLine += importNamespaceSpecifierText;
        shouldPrependComma = true;
        if (isMultiLine) {
            throw new Error('Import namespace specifier not supported in multi line imports');
        }
    }
    else {
        let shouldPrependComma = false;
        if (defaultSpecifierText) {
            if (newLine.length + defaultSpecifierText.length + 1 > newSourceStartColumn) {
                if (!isMultiLine) {
                    return false;
                }
                specifierTexts.unshift('default as ' + defaultSpecifierText);
            } else {
                newLine += defaultSpecifierText;
                shouldPrependComma = true;
            }
        }
        if (specifierTexts.length > 0) {
            if (shouldPrependComma) {
                newLine += ',' + ' ';
                shouldPrependComma = false;
            }
            newLine += '{' + (isMultiLine ? '\n' : ' ');
            for (const specifierText of specifierTexts) {
                if (isMultiLine) {
                    // prepend a tab
                    newLine += ' '.repeat(TAB_INDENT);
                } else {
                    if (shouldPrependComma) {
                        newLine += ', ';
                    } else {
                        shouldPrependComma = true;
                    }
                }
                newLine += specifierText;
                if (isMultiLine) {
                    // append a comma and new line
                    newLine += ',\n';
                }
            }
            newLine += (isMultiLine ? '' : ' ') + '}';
        }
    }

    if (isMultiLine) {
        // repeat whitespace so that ' is on position <newSourceStartColumn>,
        // subtract 5 characters for 'from ' and 1 for the curly brace
        newLine += ' '.repeat(newSourceStartColumn - 5 - 1) + 'from ' + currentImport.source.raw + ';';
        return newLine;
    } else {
        // when it fits or when it's an import namespace => generate
        // 6 characters for ' from '
        if (newLine.length + 6 <= newSourceStartColumn || importNamespaceSpecifierText) {
            // subtract 6 characters for ' from '
            const whitespacesToAdd = newSourceStartColumn - 6 - newLine.length;
            if (whitespacesToAdd > 0) {
                newLine += ' '.repeat(whitespacesToAdd);
            }
            newLine += ' from ' + currentImport.source.raw + ';';
            return newLine;
        }
        // no import namespace and no fit
        return false;
    }
}

function fixImport(currentImport, sourceCode, newSourceStartColumn) {
    let defaultSpecifierText = '';
    let specifierTexts = [];
    let importNamespaceSpecifierText = '';
    for (const specifier of currentImport.specifiers) {
        // the default specifier should be on the same line as the import
        if (specifier.type === 'ImportDefaultSpecifier') {
            defaultSpecifierText = sourceCode.getText(specifier);
        }
        else if (specifier.type === 'ImportNamespaceSpecifier') {
            importNamespaceSpecifierText = sourceCode.getText(specifier);
        }
        // other specifiers should be aligned
        else if (specifier.type === 'ImportSpecifier') {
            specifierTexts.push(sourceCode.getText(specifier));
        }
    }
    // rearrange order of the specifiers
    specifierTexts.sort();
    // first check if everything can be put on one line
    let initialResult = generateImportText(currentImport, defaultSpecifierText, importNamespaceSpecifierText,
        [...specifierTexts], newSourceStartColumn, false);
    if (initialResult) {
        return initialResult;
    }
    // if not, we will need to generate a multiple line import
    return generateImportText(currentImport, defaultSpecifierText, importNamespaceSpecifierText,
        [...specifierTexts], newSourceStartColumn, true);
}

function importFixer(incorrectImports, newSourceStartColumn, sourceCode) {
    return function* (fixer) {
        for (const incorrectImport of incorrectImports) {
            const result = fixImport(incorrectImport, sourceCode, newSourceStartColumn);
            yield fixer.replaceTextRange(incorrectImport.range, result);
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

        function importIsCorrect(currentImport, sourceCode) {
            if (currentImport.specifiers.length === 0) {
                return true;
            }
            if (currentImport.loc.start.line === currentImport.loc.end.line) {
                if (currentImport.source.loc.start.column !== newSourceStartColumn) {
                    if (currentImport.specifiers.length === 1 &&
                        currentImport.specifiers[0].type === 'ImportNamespaceSpecifier') {
                        // when only having a namespace specifier, check if it could theoretically fit
                        const loc = currentImport.specifiers[0].loc;
                        let size = loc.end.column - loc.start.column;
                        // 'import ': 7
                        // ' from ': 6
                        if (size + 7 + 6 <= newSourceStartColumn) {
                            return false;
                        }
                        // don't format import namespace when they are too large
                        // unless there are too many whitespaces
                        const currentSize = currentImport.loc.end.column - currentImport.loc.start.column;
                        const sourceSize = currentImport.source.loc.end.column - currentImport.source.loc.start.column;
                        const optimalSize = 7 + 6 + size + sourceSize + 1;// 'import ' & 'from ' & ';'
                        return currentSize === optimalSize;
                    }
                    return false;
                }
            }
            else {
                if (currentImport.source.loc.start.column !== newSourceStartColumn) {
                    return false;
                }
                let specifierIndex = 0;
                let defaultSpecifierLine = undefined;
                let formattedLineLength = 7;//'import '
                let hasNonDefault = false;
                if (currentImport.importKind && currentImport.importKind === 'type') {
                    formattedLineLength += 5;//'type '
                }
                // in this case we have a multiline import
                for (const specifier of currentImport.specifiers) {
                    specifierIndex++;
                    // the default specifier should be on the same line as the import
                    if (specifier.type === 'ImportDefaultSpecifier' || specifier.type === 'ImportNamespaceSpecifier') {
                        if (specifierIndex !== 1) {
                            // should be first line
                            return false;
                        }
                        if (specifier.loc.start.line !== currentImport.loc.start.line) {
                            return false;
                        }
                        defaultSpecifierLine = specifier.loc.start.line;
                        formattedLineLength += specifier.loc.end.column - specifier.loc.start.column;
                    }
                    // other specifiers should be aligned
                    else if (specifier.type === 'ImportSpecifier') {
                        hasNonDefault = true;
                        // first line after default should be on the line after the default
                        // there should be no { on a separate line then
                        if (defaultSpecifierLine && specifierIndex === 2) {
                            if (specifier.loc.start.line !== defaultSpecifierLine + 1) {
                                return false;
                            }
                        }
                        if (specifier.loc.start.column !== TAB_INDENT) {
                            return false;
                        }
                        formattedLineLength += specifier.loc.end.column - specifier.loc.start.column;
                    }
                }
                if (hasNonDefault) {
                    formattedLineLength += 4;// '{ ' and ' }'
                }
                formattedLineLength += (currentImport.specifiers.length - 1) * 2;//', '
                formattedLineLength += 6;//' from ';
                // when there's no way to format the imports correctly, return true
                if (formattedLineLength <= newSourceStartColumn) {
                    return false;
                }
            }
            // now verify alphabetical order
            let previousSpecifier = undefined;
            for (const specifier of currentImport.specifiers) {
                // normal specifiers should be aligned
                if (specifier.type === 'ImportSpecifier') {
                    hasNonDefault = true;
                    const newSpecifier = sourceCode.getText(specifier);
                    if (previousSpecifier && newSpecifier < previousSpecifier) {
                        return false;
                    }
                    previousSpecifier = newSpecifier;
                }
            }
            return true;
        }

        function importsDone() {
            const incorrectImports = imports.filter((currentImport) => !importIsCorrect(currentImport, context.getSourceCode()));
            if (incorrectImports.length) {
                context.report({
                    node: imports[0],
                    message: 'Imports not aligned correctly',
                    fix: importFixer(incorrectImports, newSourceStartColumn, context.getSourceCode())
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
