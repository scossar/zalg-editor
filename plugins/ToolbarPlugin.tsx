/**
 * Based on the ToolBarPlugin component from the Lexical Playground project (Meta Platforms, Inc. and affiliates).
 * This source code has been modified from its original version.
 *
 * The original code is licensed under the MIT.
 * Modifications (and possible errors) by Zalgorithm (Simon Cossar).
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Copyright (c) Zalgorithm.
 */

import { useCallback, useEffect, useState } from "react";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import {
  $getSelection,
  $createParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  LexicalEditor,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";

import DropDown, { DropDownItem } from "../ui/DropDown";
import EditorIcon from "../EditorIcon";

export type BlockType =
  | "bullet"
  | "check"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "number"
  | "paragraph"
  | "quote";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  check: "Check List",
  code: "Code Block",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
  number: "Numbered List",
  paragraph: "Paragraph",
  quote: "Quote",
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCode, setIsCode] = useState(false);

  function dropdownActiveClass(active: boolean) {
    if (active) {
      return "active dropdown-item-active bg-slate-100 rounded-sm";
    } else {
      return "";
    }
  }

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsCode(selection.hasFormat("code"));

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as BlockType);
          }
        }
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        // since this implementation is only dealing with a single editor
        // I'm not sure this call (or the activeEditor variable) is needed.
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  function BlockFormatDropDown({
    editor,
    blockType,
    disabled = false,
  }: {
    editor: LexicalEditor;
    blockType: BlockType;
    disabled: boolean;
  }): React.JSX.Element {
    const formatParagraph = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    };
    const formatHeading = (headingSize: HeadingTagType) => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        });
      }
    };

    const formatBulletList = () => {
      if (blockType !== "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    const formatNumberedList = () => {
      if (blockType !== "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    const formatQuote = () => {
      if (blockType !== "quote") {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createQuoteNode());
        });
      }
    };

    return (
      <DropDown
        disabled={disabled}
        buttonClassName="p-2 hover:bg-slate-200"
        buttonLabel={blockTypeToBlockName[blockType]}
        buttonAriaLabel="Formatting options for text type"
        blockType={blockType}
      >
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "paragraph"
          )}`}
          onClick={formatParagraph}
        >
          <EditorIcon className="inline-block w-4 h-4" id="paragraph" />{" "}
          Paragraph
        </DropDownItem>
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "h1"
          )}`}
          onClick={() => formatHeading("h1")}
        >
          <EditorIcon id="heading-1" className="inline-block w-4 h-4" /> Heading
          1
        </DropDownItem>
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "h2"
          )}`}
          onClick={() => formatHeading("h2")}
        >
          <EditorIcon id="heading-2" className="inline-block w-4 h-4" /> Heading
          2
        </DropDownItem>
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "h3"
          )}`}
          onClick={() => formatHeading("h3")}
        >
          <EditorIcon id="heading-3" className="inline-block w-4 h-4" /> Heading
          3
        </DropDownItem>
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "bullet"
          )}`}
          onClick={formatBulletList}
        >
          <EditorIcon id="fa-list-ul" className="inline-block w-4 h-4" /> Bullet
          List
        </DropDownItem>
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "number"
          )}`}
          onClick={formatNumberedList}
        >
          <EditorIcon id="fa-list-ol" className="inline-block w-4 h-4" />{" "}
          Numbered List
        </DropDownItem>
        <DropDownItem
          className={`w-full text-left p-2 hover:bg-slate-200 ${dropdownActiveClass(
            blockType === "quote"
          )}`}
          onClick={formatQuote}
        >
          <EditorIcon id="quote" className="inline-block w-4 h-4" /> Quote
        </DropDownItem>
      </DropDown>
    );
  }

  return (
    <div className="sticky flex items-center h-10 py-1 border toolbar border-b-slate-400 divide-x divide-slate-200">
      <button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo"
        className={`p-2 inline-block ${
          !canUndo || !isEditable ? "bg-white" : "bg-white"
        }`}
        type="button"
        aria-label="Undo"
      >
        <EditorIcon id="redo" className="w-4 h-4 scale-x-[-1]" />
      </button>
      <button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo"
        type="button"
        className={`p-2 inline-block ${
          !canRedo || !isEditable ? "bg-white" : "bg-white"
        }`}
        aria-label="Redo"
      >
        <EditorIcon id="redo" className="w-4 h-4" />
      </button>
      <BlockFormatDropDown
        disabled={!isEditable}
        blockType={blockType}
        editor={editor}
      />
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`p-2 rounded-sm ${
          isBold ? "bg-blue-400 text-white" : "bg-white text-slate-900"
        }`}
        title="Bold"
        type="button"
        aria-label="Format text as bold"
      >
        <EditorIcon className="w-5 h-5" id="bold" />
      </button>
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`p-2 rounded-sm ${
          isItalic ? "bg-blue-400 text-white" : "bg-white text-slate-900"
        }`}
        title="Italic"
        type="button"
        aria-label="Format text as italic"
      >
        <EditorIcon className="w-5 h-5" id="italic" />
      </button>
      <button
        disabled={!isEditable}
        className={`p-2 rounded-sm ${
          isCode ? "bg-blue-400 text-white" : "bg-white text-slate-900"
        }`}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
      >
        <EditorIcon className="w-5 h-5" id="code" />
      </button>
    </div>
  );
}
