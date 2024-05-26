# Variant form

> Link to [the playground](https://react-declarative-playground.github.io/)

![screenshot](../images/variant_form.png)

## Description

The form is divided into several sections:

 - General Information: This section includes dropdown menus for “Transaction type” with options for ‘Buy’ or ‘Rent,’ and ‘Property type’ with options for ‘Residential’ or ‘Commercial.’ There’s also a checkbox option labeled “Office,” and an open text field titled “Description,” where the text entered reads, “An apartment on the first floor for living or business purpose.”
 - Price Information (Purchase): This section contains an unchecked checkbox labeled “Exchange” and another field labeled “Commission,” which is blank.
 - General Information (Rent): This section is partially visible and does not display any filled-in data.

## Code

```tsx
import { TypedField, FieldType } from "react-declarative";

const has = (arr, value) => arr?.includes(value) ?? false;

export const fields: TypedField[] = [
    {
        type: FieldType.Paper,
        fieldBottomMargin: "1",
        fields: [
            {
                type: FieldType.Typography,
                typoVariant: "h6",
                placeholder: "General information",
            },
            {
                type: FieldType.Group,
                fields: [
                    {
                        type: FieldType.Text,
                        outlined: false,
                        placeholder: "Apartment title",
                        name: "title",
                        title: "Title",
                    },
                    {
                        type: FieldType.Items,
                        outlined: false,
                        name: "trade_type",
                        title: "Transaction type",
                        itemList: ['buy', 'rent', 'rent_day'],
                        tr: (key) => {
                            const trMap = {
                                'buy': 'Buy',
                                'rent': 'Rent',
                                'rent_day': 'Rent (day)',
                            }
                            return trMap[key] ?? key
                        },
                    },
                    {
                        type: FieldType.Items,
                        outlined: false,
                        name: "property_type",
                        title: "Property type",
                        itemList: [
                            'commercial',
                            'residential',
                        ],
                        tr: async (entry) => {
                            const trMap = {
                                'commercial': 'Commercial',
                                'residential': 'Residential',
                            };
                            return trMap[entry] ?? entry;
                        },
                    },
                    {
                        type: FieldType.Combo,
                        outlined: false,
                        name: "commercial_building_type",
                        title: "Commercial building type",
                        isVisible: ({ property_type }) =>
                            has(property_type, "commercial"),
                        itemList: [
                            'office',
                            'room',
                            'shop',
                            'restaurant',
                            'house_for_office',
                            'production_area',
                            'stock',
                            'angar',
                            'building',
                            'business_center',
                        ],
                        tr: async (entry) => {
                            const trMap = {
                                'office': 'Office',
                                'room': 'Room',
                                'shop': 'Shop',
                                'restaurant': 'Restaurant / Cafe',
                                'house_for_office': 'House for office',
                                'production_area': 'Production area',
                                'stock': 'Stock',
                                'angar': 'Hangar',
                                'building': 'Building',
                                'business_center': 'Business Center',
                            };
                            return trMap[entry] ?? entry;
                        },
                    },
                    {
                        type: FieldType.Combo,
                        outlined: false,
                        name: "residential_building_type",
                        title: "Residential building type",
                        isVisible: ({ property_type }) =>
                            has(property_type, "residential"),
                        itemList: [
                            'house',
                            'flat',
                            'angar',
                        ],
                        tr: async (entry) => {
                            const trMap = {
                                'house': 'House',
                                'flat': 'Flat',
                                'angar': 'Hangar',
                            };
                            return trMap[entry] ?? entry;
                        },
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        placeholder: "Apartment description",
                        name: "description",
                        title: "Description",
                        inputRows: 3,
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ trade_type }) => has(trade_type, "buy"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Price information (Purchase)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "buy_price",
                                title: "Purchase price",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "buy_is_exchange",
                                title: "Exchange",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "buy_commission_number",
                        title: "Commission",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ trade_type }) => has(trade_type, "rent"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Price information (Rent)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "rent_price",
                        title: "Rental price",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "rent_commission_number",
                        title: "Commission",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ trade_type }) => has(trade_type, "rent_day"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Price information (Daily Rental)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "rent_day_price",
                        title: "Price (Day)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "rent_day_commission_number",
                        title: "Commission",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Paper,
        fieldBottomMargin: "1",
        fields: [
            {
                type: FieldType.Typography,
                typoVariant: "h6",
                placeholder: "Location information",
            },
            {
                type: FieldType.Text,
                outlined: false,
                inputFormatterAllowed: /^[0-9]/,
                inputFormatterTemplate: "0000000000000000",
                name: "distance_to_metro",
                title: "Distance to metro (m)",
            },
        ],
    },
    {
        type: FieldType.Paper,
        fieldBottomMargin: "1",
        fields: [
            {
                type: FieldType.Typography,
                typoVariant: "h6",
                placeholder: "Building information",
            },
            {
                type: FieldType.Div,
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                },
                fields: [
                    {
                        type: FieldType.Checkbox,
                        sx: {
                            display: "flex",
                            alignItems: "center !important",
                        },
                        name: "is_repaired",
                        title: "Major repairs",
                    },
                ],
            },
            {
                type: FieldType.Text,
                outlined: false,
                inputFormatterAllowed: /^[0-9]/,
                inputFormatterTemplate: "0000000000000000",
                name: "total_area",
                title: "Total area (m2)",
            },
            {
                type: FieldType.Text,
                outlined: false,
                inputFormatterAllowed: /^[0-9.]/,
                inputFormatterTemplate: "0000000000000000",
                name: "ceiling_height",
                title: "Ceiling height (m)",
            },
            {
                type: FieldType.Date,
                outlined: false,
                name: "building_year",
                title: "Year of construction",
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ residential_building_type, property_type }) =>
            residential_building_type === "house" &&
            has(property_type, "residential"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the house (Residential premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "living_space",
                                title: "Living space (m2)",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "Furnished",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "kitchen_area",
                        title: "Kitchen area (m)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_floors",
                        title: "Number of floors",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_rooms",
                        title: "Number of rooms",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "bathroom_count",
                        title: "Number of restrooms",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ residential_building_type, property_type }) =>
            residential_building_type === "flat" &&
            has(property_type, "residential"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the apartment (Residential premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "living_space",
                                title: "Living space (m2)",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "kitchen_area",
                        title: "Kitchen area (m)",
                    },

                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "floor",
                        title: "Gender (m)",
                    },

                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_rooms",
                        title: "Number of rooms",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "bathroom_count",
                        title: "Number of restrooms",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "office" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the office (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "number_of_floors",
                                title: "Number of floors",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },

                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "bathroom_count",
                        title: "Number of restrooms",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "floor",
                        title: "Gender (m)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Number of parting spaces",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ residential_building_type, property_type }) =>
            residential_building_type === "hangar" &&
            has(property_type, "residential"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Hangar Information (Accommodation)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_floors",
                        title: "Number of floors",
                    },
                ],
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "room" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Room information (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "number_of_floors",
                                title: "Number of floors",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "bathroom_count",
                        title: "Number of restrooms",
                    },
                    {
                        type: FieldType.Text,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "floor",
                        title: "Gender (m)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "shop" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the store (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "restaurant" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the cafe (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "house_for_office" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the house for office (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "production_area" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder:
                            "Information about the production area (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "stock" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the warehouse (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "building" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the building (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_floors",
                        title: "Number of floors",
                    },
                ],
            },
        ],
    },

    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "business_center" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the business center (Commercial premises)",
                    },
                    {
                        type: FieldType.Div,
                        style: {
                            display: "grid",
                            gridTemplateColumns: "1fr auto",
                        },
                        fields: [
                            {
                                type: FieldType.Text,
                                outlined: false,
                                inputFormatterAllowed: /^[0-9]/,
                                inputFormatterTemplate: "0000000000000000",
                                name: "bathroom_count",
                                title: "Number of restrooms",
                            },
                            {
                                type: FieldType.Checkbox,
                                sx: {
                                    display: "flex",
                                    alignItems: "center !important",
                                },
                                name: "is_furnished",
                                title: "With furniture",
                            },
                        ],
                    },
                    {
                        type: FieldType.Checkbox,
                        name: "availability_of_elevators",
                        title: "Availability of elevators",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_floors",
                        title: "Number of floors",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_parking_spaces",
                        title: "Parking spaces",
                    },
                ],
            },
        ],
    },
    {
        type: FieldType.Fragment,
        isVisible: ({ commercial_building_type, property_type }) =>
            commercial_building_type === "hangar" &&
            has(property_type, "commercial"),
        fields: [
            {
                type: FieldType.Paper,
                fieldBottomMargin: "1",
                fields: [
                    {
                        type: FieldType.Typography,
                        typoVariant: "h6",
                        placeholder: "Information about the hangar (Commercial premises)",
                    },
                    {
                        type: FieldType.Text,
                        outlined: false,
                        inputFormatterAllowed: /^[0-9]/,
                        inputFormatterTemplate: "0000000000000000",
                        name: "number_of_floors",
                        title: "Number of floors",
                    },
                ],
            },
        ],
    },
];
```
