import FieldType from '../../../model/FieldType';

export const initialValue = (type: FieldType) => {
    if (type === FieldType.Checkbox) {
      return false;
    } else if (type === FieldType.Radio) {
      return "";
    } else if (type === FieldType.Text) {
      return "";
    } else if (type === FieldType.Switch) {
      return false;
    } else if (type === FieldType.Progress) {
      return 1.0;
    } else if  (type === FieldType.Slider) {
      return 0;
    } else if (type === FieldType.Combo) {
      return null;
    } else if (type === FieldType.Items) {
      return null;
    } else if (type === FieldType.Rating) {
      return 3;
    } else if (type === FieldType.Typography) {
      return '';
    } else {
      console.warn('form-tools initialValue unknown type');
      return "";
    }
  };

export default initialValue;
