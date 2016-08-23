'use strict';

import Form from './form';
import Type from '../type';

class Checklist extends Form {
  /**
   * @param {Object} options
   * @param {String} type
   * @constructor
   */
  constructor(options, type) {
    // Override the type of the children element by ChecklistRows
    options.children = {
      type: Type.ChecklistRow
    };

    super(options, type);
  }
}

export default Checklist;
