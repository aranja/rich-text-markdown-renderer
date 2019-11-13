import { Document, BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';

import { documentToMarkdownString, Options } from '../index';
import {
  hrDoc,
  hyperlinkDoc,
  paragraphDoc,
  invalidMarksDoc,
  invalidTypeDoc,
  headingDoc,
  marksDoc,
  embeddedEntryDoc,
  olDoc,
  olNestedDoc,
  ulDoc,
  quoteDoc
} from './documents';
import inlineEntity from './documents/inline-entity';

describe('documentToMarkdownString', () => {
  it('returns empty string when given an empty document', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: []
    };

    expect(documentToMarkdownString(document)).toEqual('');
  });

  it('renders nodes with default node renderer', () => {
    const docs: Array<{ doc: Document; expected: string }> = [
      {
        doc: paragraphDoc,
        expected: 'hello world'
      },
      {
        doc: headingDoc(BLOCKS.HEADING_1),
        expected: '# hello world'
      },
      {
        doc: headingDoc(BLOCKS.HEADING_2),
        expected: '## hello world'
      }
    ];

    docs.forEach(({ doc, expected }) => {
      expect(documentToMarkdownString(doc)).toEqual(expected);
    });
  });

  it('renders marks with default mark renderer', () => {
    const docs: Array<{ doc: Document; expected: string }> = [
      {
        doc: marksDoc(MARKS.ITALIC),
        expected: '_hello world_'
      },
      {
        doc: marksDoc(MARKS.BOLD),
        expected: '**hello world**'
      },
      {
        doc: marksDoc(MARKS.UNDERLINE),
        expected: '__hello world__'
      },
      {
        doc: marksDoc(MARKS.CODE),
        expected: '```hello world```'
      }
    ];

    docs.forEach(({ doc, expected }) => {
      expect(documentToMarkdownString(doc)).toEqual(expected);
    });
  });

  it('renders nodes with passed custom node renderer', () => {
    const options: Options = {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) => `<p>${next(node.content)}</p>`
      }
    };
    const document: Document = paragraphDoc;
    const expected = `<p>hello world</p>`;

    expect(documentToMarkdownString(document, options)).toEqual(expected);
  });

  it('renders marks with the passed custom mark rendered', () => {
    const options: Options = {
      renderMark: {
        [MARKS.UNDERLINE]: text => `<u>${text}</u>`
      }
    };
    const document: Document = marksDoc(MARKS.UNDERLINE);
    const expected = '<u>hello world</u>';

    expect(documentToMarkdownString(document, options)).toEqual(expected);
  });

  it('renders escaped markdown', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'foo **bar**',
              marks: [],
              data: {}
            }
          ]
        }
      ]
    };
    const expected = 'foo \\*\\*bar\\*\\*';

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders escaped markdown with marks', () => {
    const document: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'foo **bar**',
              marks: [{ type: MARKS.UNDERLINE }, { type: MARKS.BOLD }],
              data: {}
            }
          ]
        }
      ]
    };
    const expected = '**__foo \\*\\*bar\\*\\*__**';

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('does not render unrecognized marks', () => {
    const document: Document = invalidMarksDoc;
    const expected = 'Hello world!';

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders empty node if type is not recognized', () => {
    const document: Document = invalidTypeDoc;
    const expected = '';

    expect(documentToMarkdownString(document as Document)).toEqual(expected);
  });

  it('renders default entry link block', () => {
    const entrySys = {
      sys: {
        id: '9mpxT4zsRi6Iwukey8KeM',
        link: 'Link',
        linkType: 'Entry'
      }
    };
    const document: Document = embeddedEntryDoc(entrySys);
    const expected = ``;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders ordered lists', () => {
    const document: Document = olDoc;
    const expected = `1. Hello\n2. world`;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders nested ordered lists', () => {
    const document: Document = olNestedDoc;
    const expected =
      '1. Hello\n2. world\n\t1. Nested Item 1\n\t\t- Deep Nested Item 1\n\t\t- Deep Nested Item 2\n\t2. Nested Item 2';

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders unordered lists', () => {
    const document: Document = ulDoc;
    const expected = `- Hello\n- world`;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders blockquotes', () => {
    const document: Document = quoteDoc;
    const expected = `hello\n\n> world`;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders horizontal rule', () => {
    const document: Document = hrDoc;
    const expected = 'hello world\n\n---';

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('does not crash with inline elements (e.g. hyperlink)', () => {
    const document: Document = hyperlinkDoc;

    expect(documentToMarkdownString(document)).toBeTruthy();
  });

  it('renders hyperlink', () => {
    const document: Document = hyperlinkDoc;
    const expected = 'Some text [link](https://url.org) text.';

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it(`renders asset hyperlink`, () => {
    const asset = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Asset'
        }
      }
    };
    const document: Document = inlineEntity(asset, INLINES.ASSET_HYPERLINK);
    const expected = `[type: ${INLINES.ASSET_HYPERLINK} id: ${asset.target.sys.id}]`;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders entry hyperlink', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Entry'
        }
      }
    };
    const document: Document = inlineEntity(entry, INLINES.ENTRY_HYPERLINK);
    const expected = `[type: ${INLINES.ENTRY_HYPERLINK} id: ${entry.target.sys.id}]`;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('renders embedded entry', () => {
    const entry = {
      target: {
        sys: {
          id: '9mpxT4zsRi6Iwukey8KeM',
          link: 'Link',
          type: 'Entry'
        }
      }
    };
    const document: Document = inlineEntity(entry, INLINES.EMBEDDED_ENTRY);
    const expected = `[type: ${INLINES.EMBEDDED_ENTRY} id: ${entry.target.sys.id}]`;

    expect(documentToMarkdownString(document)).toEqual(expected);
  });

  it('does not crash with empty documents', () => {
    expect(documentToMarkdownString({} as Document)).toEqual('');
  });

  it('does not crash with undefined documents', () => {
    expect(documentToMarkdownString(undefined as Document)).toEqual('');
  });
});
