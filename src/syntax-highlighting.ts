import hljs from 'highlight.js/lib/core';

import xml from 'highlight.js/lib/languages/xml';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';

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
    } else if (fileExtension === 'c') {
        language = 'c';
        hljs.registerLanguage('c', c);
    } else if (fileExtension === 'java') {
        language = 'java';
        hljs.registerLanguage('java', java);
    } else if (fileExtension === 'cs') {
        language = 'cs';
        hljs.registerLanguage('cs', csharp);
    }

    const options = { language };
    return hljs.highlight(code, options).value;
}