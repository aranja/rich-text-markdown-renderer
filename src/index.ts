import escape from 'escape-markdown';
import {
  Document,
  Mark,
  Text,
  BLOCKS,
  MARKS,
  INLINES,
  Block,
  Inline,
  helpers,
} from '@contentful/rich-text-types';

const defaultNodeRenderers: RenderNode = {
  [BLOCKS.PARAGRAPH]: (node, next) => wrapBlock(`${next(node.content)}\n`),
  [BLOCKS.HEADING_1]: (node, next) => wrapBlock(`# ${next(node.content)}`),
  [BLOCKS.HEADING_2]: (node, next) => wrapBlock(`## ${next(node.content)}`),
  [BLOCKS.HEADING_3]: (node, next) => wrapBlock(`### ${next(node.content)}`),
  [BLOCKS.HEADING_4]: (node, next) => wrapBlock(`#### ${next(node.content)}`),
  [BLOCKS.HEADING_5]: (node, next) => wrapBlock(`##### ${next(node.content)}`),
  [BLOCKS.HEADING_6]: (node, next) => wrapBlock(`###### ${next(node.content)}`),
  [BLOCKS.EMBEDDED_ENTRY]: (node, next) => wrapBlock(`${next(node.content)}`),
  [BLOCKS.UL_LIST]: (node, next, _parentNode, _index, level) => wrapBlock(next(node.content, level)),
  [BLOCKS.OL_LIST]: (node, next, _parentNode, _index, level) => wrapBlock(next(node.content, level)),
  [BLOCKS.LIST_ITEM]: (node, next, parentNode, index, level) => renderListItem(node, next, parentNode, index, level),
  [BLOCKS.QUOTE]: (node, next) => wrapBlock(`> ${next(node.content)}`),
  [BLOCKS.HR]: () => wrapBlock('---'),
  [INLINES.ASSET_HYPERLINK]: node => defaultInline(INLINES.ASSET_HYPERLINK, node as Inline),
  [INLINES.ENTRY_HYPERLINK]: node => defaultInline(INLINES.ENTRY_HYPERLINK, node as Inline),
  [INLINES.EMBEDDED_ENTRY]: node => defaultInline(INLINES.EMBEDDED_ENTRY, node as Inline),
  [INLINES.HYPERLINK]: (node, next) => `[${next(node.content)}](${node.data.uri})`,
};

const defaultMarkRenderers: RenderMark = {
  [MARKS.BOLD]: text => `**${text}**`,
  [MARKS.ITALIC]: text => `_${text}_`,
  [MARKS.UNDERLINE]: text => `__${text}__`,
  [MARKS.CODE]: text => `\`\`\`${text}\`\`\``,
};

const renderListItem = (node: Block | Inline, next: Next, parentNode: CommonNode, index: number, level: number) => {
  let prefix = "- ";
  if (parentNode.nodeType === BLOCKS.OL_LIST){
    prefix = `${index + 1}. `;
  }

  // Remove double linebreaks should Contentful wrap list items in paragraph tags
  return wrapBlock(`${'\t'.repeat(level)}${prefix}${next(node.content, level + 1)}`).replace('\n\n', '\n');
};

const defaultInline = (type: string, node: Inline) =>
  `[type: ${type} id: ${node.data.target.sys.id}]`;

const wrapBlock = (content: string) => {
  return `${content}\n`;
}

export type CommonNode = Text | Block | Inline;

export interface Next {
  (nodes: CommonNode[], index?: number): string;
}

export interface NodeRenderer {
  (node: Block | Inline, next: Next, parentNode: CommonNode, index: number, level: number): string;
}

export interface RenderNode {
  [k: string]: NodeRenderer;
}

export interface RenderMark {
  [k: string]: (text: string) => string;
}

export interface Options {
  /**
   * Node renderers
   */
  renderNode?: RenderNode;
  /**
   * Mark renderers
   */
  renderMark?: RenderMark;
}

/**
 * Serialize a Contentful Rich Text `document` to a markdown string.
 */
export function documentToMarkdownString(
  richTextDocument: Document,
  options: Partial<Options> = {},
): string {
  if (!richTextDocument || !richTextDocument.content) {
    return '';
  }

  return nodeListToMarkdownString(richTextDocument.content, {
    renderNode: {
      ...defaultNodeRenderers,
      ...options.renderNode,
    },
    renderMark: {
      ...defaultMarkRenderers,
      ...options.renderMark,
    },
  }, null, 0);
}

function nodeListToMarkdownString(nodes: CommonNode[], { renderNode, renderMark }: Options, parentNode: CommonNode, level: number): string {
  return nodes.map<string>((node, index) => nodeToMarkdownString(node, { renderNode, renderMark }, parentNode, index, level)).join('').trimRight();
}

function nodeToMarkdownString(node: CommonNode, { renderNode, renderMark }: Options, parentNode: CommonNode, index: number, level: number): string {
  if (helpers.isText(node)) {
    const nodeValue = escape(node.value);
    if (node.marks.length > 0) {
      return node.marks.reduce((value: string, mark: Mark) => {
        if (!renderMark[mark.type]) {
          return value;
        }
        return renderMark[mark.type](value);
      }, nodeValue);
    }

    return nodeValue;
  } else {
    const nextNode: Next = (nodes, l) => nodeListToMarkdownString(nodes, { renderMark, renderNode }, node, l || 0);
    if (!node.nodeType || !renderNode[node.nodeType]) {
      // TODO: Figure what to return when passed an unrecognized node.
      return '';
    }

    return renderNode[node.nodeType](node, nextNode, parentNode, index, level);
  }
}