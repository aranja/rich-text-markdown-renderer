import { Document } from '@contentful/rich-text-types';

export default {
  data: {},
  content: [
    {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  marks: [],
                  value: 'Hello',
                  nodeType: 'text'
                }
              ],
              nodeType: 'paragraph'
            }
          ],
          nodeType: 'list-item'
        },
        {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  marks: [],
                  value: 'world',
                  nodeType: 'text'
                }
              ],
              nodeType: 'paragraph'
            },
            {
              data: {},
              content: [
                {
                  data: {},
                  content: [
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          marks: [],
                          value: 'Nested Item 1',
                          nodeType: 'text'
                        },
                      ],
                      nodeType: 'paragraph'
                    },
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          content: [
                            {
                              data: {},
                              content: [
                                {
                                  data: {},
                                  marks: [],
                                  value: 'Deep Nested Item 1',
                                  nodeType: 'text'
                                }
                              ],
                              nodeType: 'paragraph'
                            }
                          ],
                          nodeType: 'list-item'
                        },
                        {
                          data: {},
                          content: [
                            {
                              data: {},
                              content: [
                                {
                                  data: {},
                                  marks: [],
                                  value: 'Deep Nested Item 2',
                                  nodeType: 'text'
                                }
                              ],
                              nodeType: 'paragraph'
                            }
                          ],
                          nodeType: 'list-item'
                        }
                      ],
                      nodeType: 'unordered-list'
                    }
                  ],
                  nodeType: 'list-item'
                },
                {
                  data: {},
                  content: [
                    {
                      data: {},
                      content: [
                        {
                          data: {},
                          marks: [],
                          value: 'Nested Item 2',
                          nodeType: 'text'
                        }
                      ],
                      nodeType: 'paragraph'
                    }
                  ],
                  nodeType: 'list-item'
                }
              ],
              nodeType: 'ordered-list'
            }
          ],
          nodeType: 'list-item'
        }
      ],
      nodeType: 'ordered-list'
    },
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: '',
          nodeType: 'text'
        }
      ],
      nodeType: 'paragraph'
    }
  ],
  nodeType: 'document'
} as Document;
