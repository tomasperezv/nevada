'use strict';

import ModuleNaming from './module-naming';

/**
 * @module ERBTemplating
 */
const ERBTemplating = {
  /**
   * @type {Array} _filters
   * @private
   */
  _filters: [
    {
      regex: /<%= link_to t\("[a-zA-Z_]*\.([a-zA-Z_]*)"\), ([a-zA-Z_]*), target: "([a-zA-Z_]*)" %>/,
      replacement: '<a href="[2]" target="[3]">{1}</a>'
    },
    {
      regex: /<%= t\("[a-zA-Z_]*\.([a-zA-Z_]*)"\) %>/,
      replacement: '{1}'
    },
    {
      regex: /<%= (.*) %>/,
      replacement: '[1]'
    }
  ],

  /**
   * Applies the Regex replacements
   * @param {String} input
   * @return {String}
   */
  filter(input) {
    const self = this;
    let result = input;
    this._filters.forEach((currentFilter) => {
      while (result.match(currentFilter.regex)) {
        const match = currentFilter.regex.exec(result);
        const matches = match.slice(1);
        const partial = self._replaceMatches(currentFilter.replacement, matches);
        result = result.replace(currentFilter.regex, partial);
      }
    });

    return result;
  },

  /**
   * Matches the groups returned by the regular expression with the filter replacements.
   * @param {String} placeholder
   * @param {Array} matches
   * @return {String}
   * @method _replaceMatches
   */
  _replaceMatches(placeholder, matches) {
    const moduleNaming = new ModuleNaming();
    let result = placeholder;
    matches.forEach((currentMatch, pos) => {
      if (result.indexOf(`{${pos + 1}}`) > -1) {
        /* eslint-disable no-param-reassign */
        currentMatch = moduleNaming.underScoreToCamelCase(currentMatch);
        /* eslint-enable no-param-reassign */
        result = result.replace(`{${pos + 1}}`, currentMatch);
      } else {
        result = result.replace(`[${pos + 1}]`, currentMatch);
      }
    });

    return result;
  }
};

export default ERBTemplating;
