import deepFlat from "../deepFlat";

import TypedField from "../../model/TypedField";
import FieldType from "../../model/FieldType";

describe("Create object flatmap by field", () => {
  const fields32: TypedField[] = [
    {
      type: FieldType.Group,
      fields: [
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
              fields: [
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
              ],
            },
            {
              type: FieldType.Group,
              fields: [
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                  fields: [
                    {
                      type: FieldType.Group,
                      fields: [
                        {
                          type: FieldType.Group,
                        },
                      ],
                    },
                    {
                      type: FieldType.Group,
                      fields: [
                        {
                          type: FieldType.Group,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: FieldType.Group,
        },
        {
          type: FieldType.Group,
        },
        {
          type: FieldType.Group,
        },
        {
          type: FieldType.Group,
        },
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            },
          ],
        },
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
              fields: [
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
              ],
            },
            {
              type: FieldType.Group,
              fields: [
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
                {
                  type: FieldType.Group,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const fields3: TypedField[] = [
    {
      type: FieldType.Group,
    },
    {
      type: FieldType.Group,
    },
    {
      type: FieldType.Group,
    },
  ];
  const fields50: TypedField[] = [
    {
        type: FieldType.Group,
        fields: [
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
              },
              {
                type: FieldType.Group,
                fields: [
                  {
                    type: FieldType.Group,
                  },
                  {
                    type: FieldType.Group,
                    fields: [
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                        fields: [
                          {
                            type: FieldType.Group,
                          },
                          {
                            type: FieldType.Group,
                          },
                          {
                            type: FieldType.Group,
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: FieldType.Group,
                    columns: "6",
                    fields: [
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                      },
                      {
                        type: FieldType.Group,
                      },
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: FieldType.Group,
        fields: [
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
        ]
      },
      {
        type: FieldType.Group,
        fields: [
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
          {
            type: FieldType.Group,
          },
        ]
      },
      {
        type: FieldType.Group,
      },
      {
        type: FieldType.Group,
      },
      {
        type: FieldType.Group,
      },
      {
        type: FieldType.Group,
        fields: [
          {
            type: FieldType.Group,
            fields: [
              {
                type: FieldType.Group,
              },
            ]
          },
          {
            type: FieldType.Group,
            columns: "6",
            fields: [
              {
                type: FieldType.Group,
              },
            ]
          },
        ]
      },
      {
        type: FieldType.Group,
      },
      {
        type: FieldType.Group,
      },
      {
        type: FieldType.Group,
      }
  ];
  const fields19: TypedField[] = [
    {
      type: FieldType.Group,
      fields: [
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
              fields: [
                {
                  type: FieldType.Group,
                },
              ],
            },
            {
              type: FieldType.Group,
            },
          ],
        },
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            }
          ],
        },
      ],
    },
    {
      type: FieldType.Group,
      fields: [
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            },
          ],
        },
        {
          type: FieldType.Group,
          fields: [
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            },
            {
              type: FieldType.Group,
            },
          ],
        },
      ],
    },
  ];
  it ('Will pass deepFlat testcases', () => {
    expect(deepFlat(fields50, 'fields').length).toBe(50);
    expect(deepFlat(fields32, 'fields').length).toBe(32);
    expect(deepFlat(fields19, 'fields').length).toBe(19);
    expect(deepFlat(fields3, 'fields').length).toBe(3);
  });
});
