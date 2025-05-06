import MarkdownIt from "markdown-it";
import mdKatex from "@traptitech/markdown-it-katex";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

// md转换为html
const mdi = new MarkdownIt({
  linkify: true,
  highlight(code, language) {
    const validLang = !!(language && hljs.getLanguage(language));
    if (validLang) {
      const lang = language ?? "";
      return highlightBlock(hljs.highlight(lang, code, true).value, lang);
    }
    return highlightBlock(hljs.highlightAuto(code).value, "");
  },
});

mdi.use(mdKatex, {
  blockClass: "katexmath-block rounded-md p-[10px]",
  errorColor: " #cc0000",
});

function highlightBlock(str: string, lang: string) {
  lang = lang || "text";
  return `<pre class="pre-code-box">
              <div class="pre-code-header" 
              style = "
                  background-color: #50505a;
                  padding: 0.2rem;
                  padding-left: 1rem;
                  color: white;
                  font-size: 1rem;
                  border-top-left-radius: 10px;
                  border-top-right-radius: 10px;
              "><span class="code-block-header__lang">${lang}</span></div><div class="pre-code"><code class="hljs code-block-body ${lang}" style="padding:1.5rem; font-size: 1.05rem;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px;" >${str}</code></div></pre>`;
}

export default mdi;
