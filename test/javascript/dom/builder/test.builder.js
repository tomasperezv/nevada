'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';
import FragmentBuilder from '../../../../src/javascript/dom/builder/builder';

/**
 * @test {FragmentBuilder}
 */
describe('FragmentBuilder', () => {
  /**
   * @param {String} id
   * @param {String} content
   * @method _injectTemplate
   */
  const _injectTemplate = (id, content) => {
    // Inject the template into the DOM
    const template = document.createElement('script');
    template.type = 'text/template';
    template.id = `dom-builder-${id}`;
    template.innerHTML = `<div class="dynamic_form_field dynamic_form_field_test">${content}</div></div>`;
    document.body.appendChild(template);
  };

  afterEach(() => {
    FragmentBuilder.clear();
  });

  // Initialize the fake DOM that jsdom exposes
  jsdom();

  /**
   * @test {FragmentBuilder#get}
   */
  it('Returns a DocumentFragment', () => {
    const fragment = FragmentBuilder.get('test');
    assert.notEqual(fragment, null);
  });

  /**
   * @test {FragmentBuilder#get}
   */
  it('Fragments are cached', () => {
    let fragment = FragmentBuilder.get('test');
    assert.notEqual(fragment, null);
    assert.notEqual(typeof FragmentBuilder._templates.test, 'undefined');

    fragment = FragmentBuilder.get('test');
    assert.notEqual(fragment, null);
  });

  /**
   * @test {FragmentBuilder#_parseStringTemplate}
   */
  it('Generates the template from the DOM', () => {
    _injectTemplate('test', 'content');

    let fragment = FragmentBuilder.get('test');
    assert.notEqual(fragment, null);
    assert.equal(fragment.textContent, 'content');
  });

  /**
   * @test {FragmentBuilder#clear}
   */
  it('The cache is cleared', () => {
    assert.equal(typeof FragmentBuilder._templates['test'], 'undefined');
    let fragment = FragmentBuilder.get('test');
    assert.notEqual(typeof FragmentBuilder._templates['test'], 'undefined');

    FragmentBuilder.clear();
    assert.equal(typeof FragmentBuilder._templates['test'], 'undefined');
  });
});
