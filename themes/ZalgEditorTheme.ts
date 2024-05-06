import type { EditorThemeClasses } from "lexical";

import "./ZalgEditorTheme.css";

const theme: EditorThemeClasses = {
  heading: {
    h1: "ZalgorithmEditorTheme__h1",
    h2: "ZalgorithmEditorTheme__h2",
    h3: "ZalgorithmEditorTheme__h3",
    h4: "ZalgorithmEditorTheme__h4",
  },
  list: {
    ul: "ZalgorithmEditorTheme__ul",
    ol: "ZalgorithmEditorTheme__ol1",
  },
  quote: "ZalgorithmEditorTheme__quote",
  link: "ZalgorithmEditorTheme__link",
  text: {
    bold: "ZalgorithmEditorTheme__textBold",
    code: "ZalgorithmEditorTheme__textCode",
    italic: "ZalgorithmEditorTheme__textItalic",
  },
};

export default theme;
