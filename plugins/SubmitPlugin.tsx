import { useFetcher } from "@remix-run/react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

type SubmitProps = {
  submitType: "html" | "markdown";
};

export default function SubmitPlugin({ submitType }: SubmitProps) {
  const fetcher = useFetcher();

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
    </div>
  );
}
