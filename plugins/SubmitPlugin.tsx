import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

export interface CustomFetcher {
  submit: (data: FormData, options: { method: string }) => void;
}

export type SubmitProps = {
  submitType: "html" | "markdown";
  fetcher: CustomFetcher;
  toggleOpenState?: () => void;
};

export default function SubmitPlugin({
  submitType,
  fetcher,
  toggleOpenState,
}: SubmitProps) {
  const [editor] = useLexicalComposerContext();

  function handleSubmit() {
    editor.getEditorState().read(() => {
      let generated: string;
      try {
        generated =
          submitType === "html"
            ? $generateHtmlFromNodes(editor)
            : $convertToMarkdownString(TRANSFORMERS);
      } catch (error) {
        console.error("Error generating string from editor nodes.");
        throw new Response("unable to submit...");
      }
      const formData = new FormData();
      formData.append(submitType, generated);
      fetcher.submit(formData, { method: "POST" });
    });
  }

  return (
    <div>
      <button onClick={handleSubmit}>Reply</button>
      <button onClick={toggleOpenState}>close</button>
    </div>
  );
}
