import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "./ui/ContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "./utils/url";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import ZalgAutoLinkPlugin from "./plugins/ZalgAutoLinkPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import Placeholder from "./ui/Placeholder";

export default function Editor() {
  const text = "";
  const placeholder = <Placeholder>{text}</Placeholder>;
  return (
    <>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <div className="relative editor-scroller">
            <div className="relative editor">
              <ContentEditable className="relative overflow-y-scroll h-72" />
            </div>
          </div>
        }
        placeholder={placeholder}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ZalgAutoLinkPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <LexicalClickableLinkPlugin />
      <ListPlugin />
    </>
  );
}
