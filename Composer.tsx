import { LexicalComposer } from "@lexical/react/LexicalComposer";
import ZalgEditorTheme from "./themes/ZalgEditorTheme";
import { EditorNodes } from "./editorNodes/EditorNodes";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import Editor from "./Editor";

export default function Composer() {
  const initialConfig = {
    namespace: "Zalgorithm",
    onError: (error: Error) => {
      throw error;
    },
    theme: ZalgEditorTheme,
    nodes: [...EditorNodes],
  };
  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <HistoryPlugin />
        <div className="relative border rounded-sm border-slate-900">
          <Editor />
        </div>
      </LexicalComposer>
    </>
  );
}
