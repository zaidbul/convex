import {
  TextNode,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
} from "lexical";

export type MentionNodePayload = {
  id: string;
  label: string;
};

export type SerializedMentionNode = {
  mentionId: string;
  mentionLabel: string;
  type: "mention";
  version: 1;
} & SerializedTextNode;

export class MentionNode extends TextNode {
  __id: string;
  __label: string;

  static override getType(): string {
    return "mention";
  }

  static override clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__label, node.__id, node.__key);
  }

  static override importJSON(json: SerializedMentionNode): MentionNode {
    const node = new MentionNode(json.mentionLabel, json.mentionId);
    node.setFormat(json.format);
    node.setDetail(json.detail);
    node.setMode(json.mode);
    node.setStyle(json.style);
    return node;
  }

  constructor(label: string, id: string, key?: NodeKey) {
    super(`@${label}`, key);
    this.__id = id;
    this.__label = label;
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.dataset.mentionId = this.__id;
    dom.dataset.mentionLabel = this.__label;
    dom.classList.add("mention");
    const mentionThemeClass = config.theme.mention;
    if (typeof mentionThemeClass === "string") {
      for (const className of mentionThemeClass.split(/\s+/)) {
        if (className) dom.classList.add(className);
      }
    }
    return dom;
  }

  override exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionId: this.__id,
      mentionLabel: this.__label,
      type: "mention",
      version: 1,
    };
  }

  override canInsertTextBefore(): boolean {
    return false;
  }

  override canInsertTextAfter(): boolean {
    return false;
  }

  override isTextEntity(): true {
    return true;
  }

  getId(): string {
    return this.__id;
  }

  getLabel(): string {
    return this.__label;
  }
}

export function $createMentionNode({ id, label }: MentionNodePayload): MentionNode {
  return new MentionNode(label, id).setMode("token");
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode;
}
