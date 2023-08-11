import hljs from 'highlight.js/lib/core';

import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';

import * as esprima from 'esprima';
// import { parse } from '@typescript-eslint/parser';

function getFileExtension(fileName: string) {
    const arr = fileName.split('.');
    return arr[arr.length - 1];
}

function javascriptCodeParser(script: string | undefined) {
    if (!script)
        return;

    var result = null;

    try {
        result = esprima.parseScript(script, { loc: true });
        result = {
            "status": "Success",
            "result": result
        }
    } catch (error: any) {
        result = {
            "status": "Failure",
            "errors": [
                {
                    "descrription": error.description,
                    "line": error.lineNumber
                }
            ]
        }
    }

    return result;
}

function typescriptCodeParser(script: string | undefined) {
    if (!script)
        return;

    // const ast = parse(script, {
    //     sourceType: 'module',
    //     ecmaVersion: 2021,
    // });
    
    // console.log(ast);
}

async function pythonCodeParser(script: string | undefined) {
    if (!script)
        return;

    try {
        // @ts-ignore
        const parsingResult: Object = await window.electron.pythonCodeParser(script);
        return parsingResult;
    } catch (error) {
        console.log("Code parser failed: ", error);
        throw error;
    }
}

async function javaCodeParser(script: string | undefined) {
    if (!script)
        return;

    try {
        // @ts-ignore
        const parsingResult: Object = await window.electron.javaCodeParser(script);
        return parsingResult;
    } catch (error) {
        console.log("Code parser failed: ", error);
        throw error;
    }
}

function addUnderliningForParsingErrors(code: string, parsingResult: any) {
    if (!parsingResult || parsingResult.status === "Success")
        return code;

    // Underline first line
    //console.log("Number of lines ", code.split("\n").length);
    const codeLines = code.split("\n");
    const lineIndex = parsingResult.errors[0].line - 1;
    codeLines[lineIndex] = "<div class='error-line'>" + codeLines[lineIndex] + "</div>";

    return codeLines.join("\n");
}

export async function syntaxHighlightingAndParsing(code: string, fileName: string) {
    var language = '';
    const fileExtension = getFileExtension(fileName);
    if (fileExtension === undefined || fileExtension === "")
        return;

    var parsingResult: Object | undefined = undefined;

    if (fileExtension === 'html') {
        language = 'xml';
        hljs.registerLanguage('xml', xml);
    } else if (fileExtension === 'js') {
        // Call javascript parser
        parsingResult = javascriptCodeParser(code);

        language = 'javascript';
        hljs.registerLanguage('javascript', javascript);
    } else if (fileExtension === 'ts') {
        // Call typescript parser
        typescriptCodeParser(code);

        language = 'typescript';
        hljs.registerLanguage('typescript', typescript);
    } else if (fileExtension === 'py') {
        // Call python parser
        parsingResult = await pythonCodeParser(code);

        language = 'python';
        hljs.registerLanguage('python', python);
    } else if (fileExtension === 'cpp') {
        language = 'cpp';
        hljs.registerLanguage('cpp', cpp);
    } else if (fileExtension === 'c') {
        language = 'c';
        hljs.registerLanguage('c', c);
    } else if (fileExtension === 'java') {
        const x = await javaCodeParser(code);
        console.log("X", x);
        language = 'java';
        hljs.registerLanguage('java', java);
    } else if (fileExtension === 'cs') {
        language = 'cs';
        hljs.registerLanguage('cs', csharp);
    }

    const options = { language };
    return addUnderliningForParsingErrors(hljs.highlight(code, options).value, parsingResult);
}