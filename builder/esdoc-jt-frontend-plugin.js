'use strict';

/**
 * This plugin uses the esdoc API to define a plugin that provides
 * custom functionality that we need in order to integrate esdoc
 * and webpack in order to generate a documentation sandbox.
 *
 * @module esdoc-jt-frontend-plugin
 * @see https://esdoc.org/api.html#plugin-feature
 */
const ESDocJTFrontendPlugin = {
  /**
   * @type {Object} _templates
   * @private
   */
  _templates: [
    {
      id: '<a href="test.html" data-ice="testLink">Test</a>',
      value: '<a href="test.html" data-ice="testLink">Test</a><a href="../js-unit-tests.html">Unit tests</a>'
    },
    {
      id: 'manual/overview.md',
      value: '/doc/manual/index.html'
    },
    {
      id: 'manual/installation.md',
      value: '/doc/manual/installation.html'
    },
    {
      id: 'manual/usage.md',
      value: '/doc/manual/usage.html'
    },
    {
      id: 'manual/example.md',
      value: '/doc/manual/example.html'
    },
    {
      id: 'manual/faq.md',
      value: '/doc/manual/faq.html'
    }
  ],

  /**
   * Stores the definition of the file processor we want to apply
   * @type {Object} _processors
   * @private
   */
  _processors: {
    html: (content) => {
      const templates = ESDocJTFrontendPlugin._templates;
      templates.map((template) => {
        if (content.indexOf(template.id) >= 0) {
          /* eslint-disable no-param-reassign */
          content = content.replace(template.id, template.value);
          /* eslint-disable no-param-reassign */
        }
      });
      return content;
    }
  },

  /**
   * @param {Object} ev
   * @method onHandleHTML
   * @public
   */
  onHandleHTML(ev) {
    const filename = ev.data.fileName;
    const extension = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[1];
    if (typeof this._processors[extension] === 'function') {
      const html = ev.data.html;
      /* eslint-disable no-param-reassign */
      ev.data.html = this._processors[extension].bind(this)(html);
      /* eslint-enable no-param-reassign */
    }
  }
};

module.exports = ESDocJTFrontendPlugin;
