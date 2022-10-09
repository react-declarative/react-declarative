import React from "react";

import { useState, useEffect, Fragment } from "react";

import { Box } from "@mui/material";

import { TypedField, FieldType, OneTyped } from "react-declarative";

import Logger from "../components/Logger";

const fields: TypedField[] = [
  {
    type: FieldType.Group,
    fields: [
      {
        type: FieldType.Group,
        child: {
          type: FieldType.Div,
          style: {
            display: "grid",
            gridTemplateColumns: "auto 1fr",
          },
          fields: [
            {
              type: FieldType.Div,
              style: {
                display: 'flex',
                flexDirection: 'column',
                marginRight: '15px',
              },
              fields: [
                {
                  type: FieldType.Component,
                  element: () => (
                    <Box display="flex" justifyContent="center">
                      <Box
                        style={{
                          background: "#54545447",
                          height: "200px",
                          width: "200px",
                          marginTop: "25px",
                        }}
                      />
                    </Box>
                  ),
                },
                {
                  type: FieldType.Rating,
                  name: "rate",
                },
              ],
            },
            {
              type: FieldType.Group,
              fields: [
                {
                  type: FieldType.Line,
                  title: "Профиль",
                },
                {
                  type: FieldType.Combo,
                  title: "Пол",
                  placeholder: "Выберите один",
                  name: "gender",
                  itemList: ["Male", "Female", "Other"],
                },
                {
                  type: FieldType.Items,
                  title: "Списки",
                  placeholder: "Выберите несколько",
                  name: "list",
                  itemList: ["Blocklist", "VIP", "Other people"],
                },
                {
                  type: FieldType.Group,
                  fields: [
                    {
                      type: FieldType.Group,
                      columns: "9",
                      fields: [
                        {
                          type: FieldType.Text,
                          outlined: false,
                          title: "Кодовая фраза",
                          name: "keyword",
                          placeholder: "September",
                          isDisabled: (obj) => !obj.keywordEnabled,
                        },
                      ],
                    },
                    {
                      type: FieldType.Group,
                      columns: "3",
                      fields: [
                        {
                          type: FieldType.Checkbox,
                          title: "Кодовая фраза",
                          name: "keywordEnabled",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        type: FieldType.Line,
        title: "Общая информация",
      },
      {
        name: "firstName",
        type: FieldType.Text,
        title: "Имя",
        description: "Felton",
      },
      {
        name: "lastName",
        type: FieldType.Text,
        title: "Фамилия",
        description: "Cruickshank",
      },
      {
        name: "age",
        type: FieldType.Text,
        title: "Возраст*",
        description: "42",
        isInvalid: (obj) => {
          const value = Number(obj.age);
          if (!Number.isInteger(value)) {
            return "Возраст должен быть числом";
          } else if (value < 1) {
            return "Возраст должен быть больше 1";
          } else {
            return null;
          }
        },
      },
      {
        type: FieldType.Expansion,
        title: "Подписка",
        description: "Подписка на уведомления",
        fields: [
          {
            type: FieldType.Switch,
            name: "subscribed",
            title: "Разрешить рассылку",
          },
          {
            name: "email",
            type: FieldType.Text,
            isDisabled: (obj) => !obj.subscribed,
            isInvalid({ email }) {
              const expr = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g;
              if (!expr.test(email)) {
                return "Указан неверный адрес электронной почты";
              } else {
                return null;
              }
            },
            title: "Почта*",
            description: "tripolskypetr@gmail.com",
          },
        ],
      },
      {
        type: FieldType.Group,
        fields: [
          {
            type: FieldType.Group,
            columns: "6",
            fields: [
              {
                type: FieldType.Line,
                title: "Работа",
              },
              {
                name: "jobTitle",
                type: FieldType.Text,
                title: "Должность",
              },
              {
                name: "jobArea",
                type: FieldType.Text,
                title: "Место работы",
              },
            ],
          },
          {
            type: FieldType.Group,
            columns: "6",
            fields: [
              {
                type: FieldType.Line,
                title: "Домашний адрес",
              },
              {
                name: "country",
                type: FieldType.Text,
                title: "Страна",
              },
              {
                name: "city",
                type: FieldType.Text,
                title: "Город",
              },
              {
                name: "state",
                type: FieldType.Text,
                title: "Область",
              },
              {
                name: "address",
                type: FieldType.Text,
                title: "Адрес",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const SamplePage = () => {
  const [data, setData] = useState<any>();
  useEffect(() => {
    /**
     * Фильтрация первого срабатывания, это не
     * ошибка компонента...
     */
    if (typeof data === "object") {
      console.log(data);
    }
  }, [data]);
  return (
    <Fragment>
      <OneTyped
        fields={fields}
        invalidity={() => setData(null)}
        change={(newData) => setData(newData)}
      />
      <Logger {...(data || {})} />
    </Fragment>
  );
};

export default SamplePage;
