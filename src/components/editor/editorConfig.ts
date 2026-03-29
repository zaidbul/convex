import type { LinkMatcher } from "@lexical/react/LexicalAutoLinkPlugin"
import type { Klass, LexicalNode } from "lexical"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { ListNode, ListItemNode } from "@lexical/list"
import { CodeNode, CodeHighlightNode } from "./lexical-code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode"
import { MentionNode } from "./nodes/MentionNode"
import { ImageNode } from "./nodes/ImageNode"

const URL_REG_EXP =
  /https?:\/\/(?:www\.)?[a-zA-Z0-9\-_]+(?:\.[a-zA-Z0-9\-_]+)+(?:[/?#][^\s]*)?/g
const EMAIL_REG_EXP =
  /(?:mailto:)?[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi

export const AUTO_LINK_MATCHERS: LinkMatcher[] = [
  (text: string) => {
    URL_REG_EXP.lastIndex = 0
    const match = URL_REG_EXP.exec(text)
    if (!match) return null
    const url = match[0]
    return { index: match.index, length: url.length, text: url, url }
  },
  (text: string) => {
    EMAIL_REG_EXP.lastIndex = 0
    const match = EMAIL_REG_EXP.exec(text)
    if (!match) return null
    const value = match[0]
    const email = value.replace(/^mailto:/i, "")
    const url = value.startsWith("mailto:") ? value : `mailto:${email}`
    return { index: match.index ?? 0, length: value.length, text: email, url }
  },
]

export const EDITOR_NODES: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  HorizontalRuleNode,
  MentionNode,
  ImageNode,
]
