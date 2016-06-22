/* @flow */
'use strict';

/**
 * Encapsulates logic in charge of processing framework module naming.
 * @module ModuleNaming
 */
class ModuleNaming {
  /**
   * @param {String} input
   * @return {String}
   * @method underScoreToCamelCase
   * @public
   */
  underScoreToCamelCase(input: string): string {
    return input.split('_').map((chunk) =>
      `${chunk[0].toUpperCase()}${chunk.substring(1)} `
    ).join('').trim();
  }
}

export default ModuleNaming;
