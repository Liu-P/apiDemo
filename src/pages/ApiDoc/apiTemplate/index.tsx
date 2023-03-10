/*
 * @Description:
 * @Author: LCL
 * @Date: 2022-03-18
 * @LastEditors: LCL
 * @LastEditTime: 2022-03-23
 */

import { useRef, useState } from 'react';
import Editor from 'react-markdown-editor-lite';
// import ReactMarkdown from 'react-markdown';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import 'react-markdown-editor-lite/lib/index.css';
// import 'highlight.js/styles/base16/github.css';
import './index.css';
const mdParser = new MarkdownIt({
  highlight: (str, lang) => {
    console.log('ddddd', lang);
    let code = mdParser.utils.escapeHtml(str);
    if (lang && hljs.getLanguage(lang)) {
      code = hljs.highlight(lang, str, true).value;
    }
    return `<pre class="hljs"><code>${code}</code></pre>`;
  },
});
const ApiTemplate = () => {
  const mdEditor = useRef(null);
  const [value, setValue] = useState('xxx');
  const [data, setData] = useState('xxx');

  const handleEditorChange = ({ html, text }) => {
    const newValue = text.replace(/\d/g, '');
    console.log(newValue);
    setValue(newValue);
    console.log(html);
  };

  const handleClick = () => {
    if (mdEditor.current) {
      // setData(mdEditor.current.getMdValue());
      setData(mdEditor.current.getHtmlValue());
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Get value</button>
      <Editor
        ref={mdEditor}
        value={value}
        style={{
          height: '500px',
        }}
        onChange={handleEditorChange}
        // renderHTML={(text) => <ReactMarkdown>{text}</ReactMarkdown>}
        renderHTML={(text) => mdParser.render(text)}
      />

      <div
        style={{ padding: '10px' }}
        className="custom-html-style"
        dangerouslySetInnerHTML={{ __html: data }}
      />
      {/* <div className="custom-html-style">
        <ReactMarkdown>{data}</ReactMarkdown>
      </div> */}
    </div>
  );
};
export default ApiTemplate;
