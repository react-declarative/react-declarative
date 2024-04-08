import * as React from "react";

import FieldType from "../../../model/FieldType";
import IAnything from "../../../model/IAnything";
import IEntity from "../../../model/IEntity";

import ExpansionLayout from "../layouts/ExpansionLayout";
import PaperLayout from "../layouts/PaperLayout";
import OutlineLayout from "../layouts/OutlineLayout";
import GroupLayout from "../layouts/GroupLayout";
import FragmentLayout from "../layouts/FragmentLayout";
import DivLayout from "../layouts/DivLayout";
import BoxLayout from "../layouts/BoxLayout";
import TabsLayout from "../layouts/TabsLayout";
import CenterLayout from "../layouts/CenterLayout";
import StretchLayout from "../layouts/StretchLayout";
import HeroLayout from "../layouts/HeroLayout";
import ConditionLayout from "../layouts/ConditionLayout";
import CustomLayout from "../layouts/CustomLayout";

type Layout = (props: React.PropsWithChildren<IEntity>) => React.ReactElement;

const layoutMap: { [key in FieldType]?: Layout } = Object.create(null);

/**
 * Variable to map field types to corresponding layout classes.
 *
 * @typedef FieldTypeMap
 * @property FieldType.Group - Group layout class.
 * @property FieldType.Box - Box layout class.
 * @property FieldType.Paper - Paper layout class.
 * @property FieldType.Outline - Outline layout class.
 * @property FieldType.Expansion - Expansion layout class.
 * @property FieldType.Div - Div layout class.
 * @property FieldType.Tabs - Tabs layout class.
 * @property FieldType.Hero - Hero layout class.
 * @property FieldType.Fragment - Fragment layout class.
 * @property FieldType.Center - Center layout class.
 * @property FieldType.Stretch - Stretch layout class.
 * @property FieldType.Condition - Condition layout class.
 * @property FieldType.Layout - Custom layout class.
 */
Object.assign(layoutMap, {
  [FieldType.Group]: GroupLayout,
  [FieldType.Box]: BoxLayout,
  [FieldType.Paper]: PaperLayout,
  [FieldType.Outline]: OutlineLayout,
  [FieldType.Expansion]: ExpansionLayout,
  [FieldType.Div]: DivLayout,
  [FieldType.Tabs]: TabsLayout,
  [FieldType.Hero]: HeroLayout,
  [FieldType.Fragment]: FragmentLayout,
  [FieldType.Center]: CenterLayout,
  [FieldType.Stretch]: StretchLayout,
  [FieldType.Condition]: ConditionLayout,
  [FieldType.Layout]: CustomLayout,
});

/**
 * Фабрика для создания компоновок
 */
export const createLayout = <Data extends IAnything = IAnything>(
  entity: IEntity<Data>,
  children: React.ReactNode,
  currentPath = ""
) => {
  const { type } = entity;
  let Layout: Layout | undefined;
  if ((Layout = layoutMap[type])) {
    return (
      <Layout {...entity} key={currentPath}>
        {children}
      </Layout>
    );
  } else {
    throw new Error("FieldFactory unknown key type");
  }
};

export default createLayout;
