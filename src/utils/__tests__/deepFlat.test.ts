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
                        },
                      ],
                    },
                  ],
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
          columns: "6",
          fields: [
            {
              type: FieldType.Group,
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
            },
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
  const generator = (total = 50): [any, number] => {
    let root: TypedField[] = [];
    const randomInteger = (min = 0, max = 10) =>
      Math.round(min - 0.5 + Math.random() * (max - min + 1));
    const process = (entry = root, counter = total) => {
      const iter = randomInteger(0, Math.max(counter, 5));
      let rest = counter - iter;
      for (let i = 0; i !== iter; i++) {
        entry.push({type: FieldType.Group});
      }
      if (rest > 0) {
        const target = entry[randomInteger(0, iter)];
        target.fields = [];
        process(target.fields, rest);
      }
    };
    total = randomInteger(0, total);
    process();
    return [root, total];
  };
  it("Will pass static deepFlat testcases", () => {
    expect(deepFlat(fields50, "fields").length).toBe(50);
    expect(deepFlat(fields32, "fields").length).toBe(32);
    expect(deepFlat(fields19, "fields").length).toBe(19);
    expect(deepFlat(fields3, "fields").length).toBe(3);
  });
  it("Will pass dynamic deepFlat testcase", () => {
    const [entry, total] = generator();
    expect(deepFlat(entry, "fields").length).toBe(total);
  });
});
