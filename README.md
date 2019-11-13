# rich-text-markdown-renderer

Markdown renderer for the Contentful rich text field type. This project is based off of the [rich-text-html-rendered](https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer) from Contentful.

## Installation

Using [npm](http://npmjs.org/):

```sh
npm install @aranja/rich-text-markdown-renderer
```

Using [yarn](https://yarnpkg.com/):

```sh
yarn add @aranja/rich-text-markdown-renderer
```

## Usage

```javascript
import { documentToMarkdownString } from "@aranja/rich-text-markdown-renderer";

const document = {
  nodeType: "document",
  content: [
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: "Hello world!",
          marks: []
        }
      ]
    }
  ]
};

documentToMarkdownString(document); // -> Hello world!
```

```javascript
import { documentToMarkdownString } from "@aranja/rich-text-markdown-renderer";

const document = {
  nodeType: "document",
  content: [
    {
      nodeType: "paragraph",
      content: [
        {
          nodeType: "text",
          value: "Hello",
          marks: [{ type: "bold" }]
        },
        {
          nodeType: "text",
          value: " world!",
          marks: [{ type: "italic" }]
        }
      ]
    }
  ]
};

documentToMarkdownString(document); // -> **Hello**_ world!_
```

You can also pass custom renderers for both marks and nodes as an optional parameter like so:

```javascript
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { documentToMarkdownString } from '@aranja/rich-text-markdown-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'paragraph',
      data:{},
      content: [
        {
          nodeType: 'text',
          value: 'Hello',
          marks: [{ type: 'bold' }],
          data: {}
        },
        {
          nodeType: 'text',
          value: ' world!',
          marks: [{ type: 'italic' }]
          data: {}
        },
      ],
    },
  ]
};

const options = {
  renderMark: {
    [MARKS.BOLD]: text => `<custom-bold>${text}<custom-bold>`
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, next) => `<custom-paragraph>${next(node.content)}</custom-paragraph>`
  }
}

documentToMarkdownString(document, options);
// -> <custom-paragraph><custom-bold>Hello</custom-bold> _world!_</custom-paragraph>
```

Last, but not least, you can pass a custom rendering component for an embedded entry:

```javascript
import { BLOCKS } from '@contentful/rich-text-types';
import { documentToMarkdownString } from '@aranja/rich-text-markdown-renderer';

const document = {
  nodeType: 'document',
  data: {},
  content: [
    {
      nodeType: 'embedded-entry-block',
      data: {
        target: (...)Link<'Entry'>(...);
      },
    },
  ]
};

const options = {
  renderNode: {
    [BLOCKS.EMBEDDED_ENTRY]: (node) => `<custom-component>${customComponentRenderer(node)}</custom-component>`
  }
}

documentToMarkdownString(document, options);
// -> <custom-component>(...)Link<'Entry'>(...)</custom-component>
```

The `renderNode` keys should be one of the following `BLOCKS` and `INLINES` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BLOCKS`

  - `DOCUMENT`
  - `PARAGRAPH`
  - `HEADING_1`
  - `HEADING_2`
  - `HEADING_3`
  - `HEADING_4`
  - `HEADING_5`
  - `HEADING_6`
  - `UL_LIST`
  - `OL_LIST`
  - `LIST_ITEM`
  - `QUOTE`
  - `HR`
  - `EMBEDDED_ENTRY`
  - `EMBEDDED_ASSET`

- `INLINES`
  - `EMBEDDED_ENTRY` (this is different from the `BLOCKS.EMBEDDED_ENTRY`)
  - `HYPERLINK`
  - `ENTRY_HYPERLINK`
  - `ASSET_HYPERLINK`

The `renderMark` keys should be one of the following `MARKS` properties as defined in [`@contentful/rich-text-types`](https://www.npmjs.com/package/@contentful/rich-text-types):

- `BOLD`
- `ITALIC`
- `UNDERLINE`
- `CODE`
