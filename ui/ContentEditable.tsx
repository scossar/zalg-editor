import "./ContentEditable.css";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import * as React from "react";

export default function LexicalContentEditable({
  className,
}: {
  className?: string;
}): React.JSX.Element {
  return <ContentEditable className={className || "ContentEditable__root"} />;
}
