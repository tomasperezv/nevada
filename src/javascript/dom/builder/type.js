'use strict';

import Base from './fragment/base';
import Boolean from './fragment/boolean';
import ChecklistRow from './fragment/checklist-row';
import Checklist from './fragment/checklist';
import ComboEnumOption from './fragment/combo-enum-option';
import Date from './fragment/date';
import Enum from './fragment/enum';
import EnumOption from './fragment/enum-option';
import Form from './fragment/form';
import String from './fragment/string';

/**
 * Represents dom fragment types
 * @type {Object} Type
 */
const Type = {
  Base: 'base',
  Form: 'form',
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
  Decimal: 'decimal'
};

/**
 * Maps types with their corresponding objects
 * @type {Object} Map;
 */
const Map = {};

Map[Type.Base] = Base;
Map[Type.Boolean] = Boolean;
Map[Type.ChecklistRow] = ChecklistRow;
Map[Type.Checklist] = Checklist;
Map[Type.ComboEnumOption] = ComboEnumOption;
Map[Type.Date] = Date;
Map[Type.Enum] = Enum;
Map[Type.EnumOption] = EnumOption;
Map[Type.Form] = Form;
Map[Type.String] = String;

// Expose the modules
export default Type;
export { Map };
