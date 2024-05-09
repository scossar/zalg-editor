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
  replyToPostNumber?: string;
};

export default function SubmitPlugin({
  submitType,
  fetcher,
  toggleOpenState,
  replyToPostNumber,
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
      if (replyToPostNumber) {
        formData.append("replyToPostNumber", replyToPostNumber);
      }
      fetcher.submit(formData, { method: "POST" });
    });
  }

  return (
    <div className="flex p-2 align-center">
      <button
        className="px-2 py-1 border rounded-sm border-slate-700"
        onClick={handleSubmit}
      >
        Reply
      </button>
      <button className="mx-2" onClick={toggleOpenState}>
        close
      </button>
    </div>
  );
}
