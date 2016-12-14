'use strict';

import Base from './fragment/base';
import Boolean from './fragment/boolean';
import Button from './fragment/button';
import ButtonList from './fragment/button-list';
import ChecklistRow from './fragment/checklist-row';
import Checklist from './fragment/checklist';
import ComboEnumOption from './fragment/combo-enum-option';
import Date from './fragment/date';
import Enum from './fragment/enum';
import EnumOption from './fragment/enum-option';
import File from './fragment/file';
import Form from './fragment/form';
import String from './fragment/string';
import SimpleButton from './fragment/simple-button';

/**
 * Represents dom fragment types
 * @type {Object} Type
 */
const Type = {
  Base: 'base',
  Form: 'form',
  FormRedux: 'form-redux',
  String: 'string',
  Number: 'integer',
  Date: 'date',
  Boolean: 'boolean',
  ComboEnum: 'combo-enum',
  ComboEnumOption: 'combo-enum-option',
  Enum: 'enum',
  EnumOption: 'enum-option',
  File: 'file',
  Checklist: 'checklist',
  ChecklistRow: 'checklist-row',
  Decimal: 'decimal',
  Button: 'button',
  ButtonList: 'button-list',
  SimpleButton: 'simple-button',
  Text: 'text'
};

/**
 * Maps types with their corresponding objects
 * @type {Object} Map;
 */
const Map = {};

Map[Type.Base] = Base;
Map[Type.Boolean] = Boolean;
Map[Type.Button] = Button;
Map[Type.ButtonList] = ButtonList;
Map[Type.ChecklistRow] = ChecklistRow;
Map[Type.Checklist] = Checklist;
Map[Type.ComboEnumOption] = ComboEnumOption;
Map[Type.Date] = Date;
Map[Type.Enum] = Enum;
Map[Type.EnumOption] = EnumOption;
Map[Type.File] = File;
Map[Type.Form] = Form;
Map[Type.FormRedux] = Form;
Map[Type.String] = String;
Map[Type.SimpleButton] = SimpleButton;
Map[Type.Text] = String;

// Expose the modules
export default Type;
export { Map };
