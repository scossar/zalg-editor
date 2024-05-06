import type { Klass, LexicalNode } from "lexical";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";

export const EditorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  AutoLinkNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];
