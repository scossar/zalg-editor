/*
 * Icons for zalgEditor.
 *
 * The component assumes the existence of a `sprite.svg` file that's in a public directory with
 * the following structure:
 *    <svg...>
 *      <defs>
 *        <symbol viewBox="0 0 15 15" id="{iconId}" height="100%" width="100%">
 *          <path... />
 *        </symbol>
 *        <symbol viewBox="0 0 15 15" id="{anotherIconId}" height="100%" width="100%">
 *          <path...></path>
 *        </symbol>
 *      </defs>
 *    </svg>
 */

// the iconIds from sprite.svg
export type AvailableIconIdTypes =
  | "reset"
  | "redo"
  | "caret-up"
  | "caret-down"
  | "italic"
  | "bold"
  | "paragraph"
  | "heading"
  | "list-bullet"
  | "quote"
  | "code"
  | "link"
  | "pencil"
  | "heart"
  | "heart-filled"
  | "fa-list-ul"
  | "fa-list-ol"
  | "fa-1"
  | "fa-2"
  | "fa-3"
  | "fa-h"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "list-ol";

interface IconProps {
  id: AvailableIconIdTypes;
  className?: string;
  x?: number;
  y?: number;
}

export default function EditorIcon({
  id,
  x = 0,
  y = 0,
  className,
}: IconProps): JSX.Element {
  return (
    <svg className={className}>
      <use href={`/sprite.svg#${id}`} x={`${x}`} y={`${y}`} />
    </svg>
  );
}
