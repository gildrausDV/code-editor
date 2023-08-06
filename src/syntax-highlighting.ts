import hljs from 'highlight.js/lib/core';

import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import cpp from 'highlight.js/lib/languages/cpp';

function getFileExtension(fileName: string) {
    const arr = fileName.split('.');
    return arr[arr.length - 1];
}

export function syntaxHighlighting(code: string, fileName: string) {
    var language = '';
    const fileExtension = getFileExtension(fileName);
    if (fileExtension === undefined || fileExtension === "")
        return;

    if (fileExtension === 'html') {
        language = 'xml';
        hljs.registerLanguage('xml', xml);
    } else if (fileExtension === 'js') {
        language = 'javascript';
        hljs.registerLanguage('javascript', javascript);
    } else if (fileExtension === 'ts') {
        language = 'typescript';
        hljs.registerLanguage('typescript', typescript);
    } else if (fileExtension === 'py') {
        language = 'python';
        hljs.registerLanguage('python', python);
    } else if (fileExtension === 'cpp') {
        language = 'cpp';
        hljs.registerLanguage('cpp', cpp);
    }

    const options = { language };
    return hljs.highlight(code, options).value;
}