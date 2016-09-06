'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';
import { Map as TypeMap }  from '../../../../../src/javascript/dom/builder/type';
import Spy from '../../../../../src/javascript/test-framework/spy';
import FragmentBuilder from '../../../../../src/javascript/dom/builder/builder';

/**
 * @test {Base}
 */
describe('Base', () => {

  /**
   * @type {Object} _spy
   * @private
   */
  let _spy;

  /**
   * @type {Object} _oldConsole
   * @private
   */
  let _oldConsole;

  /**
   * @type {Object} _consoleMock
   * @private
   */
  let _consoleMock;

  /**
   * @param {Field} field
   * @method _verifyDocumentFragment
   * @private
   */
  const _verifyFieldElement = (field, fragmentType) => {
    assert.notEqual(field, null);
    assert.equal(typeof field, 'object');
    assert.equal(field.constructor.name, fragmentType);
  };

  afterEach(() => {
    _spy.restore(_consoleMock, _oldConsole);
  });

  beforeEach(() => {
    _oldConsole = global.window.console;
    _spy = new Spy();
    _consoleMock = _spy.mock(global.window.console);
  });

  // Initialize the fake DOM that jsdom exposes
  jsdom();

  const Base = TypeMap['base'];

  /**
   * @test {Base#constructor}
   */
  it('Instantiation', () => {
    assert.throws(() => { new Base() }, TypeError);

    let base = new Base({ data: {} });
    assert.equal(typeof base, 'object');
  });

  /**
   * @test {Base#constructor}
   */
  it('Type definition', () => {
    let base = new Base({ data: {} }, 'test');
    assert.equal(base._type, 'test');
  });

  /**
   * @test {Base#getFragment}
   */
  it('Basic fragment composition', () => {
    let base = new Base({ data: {} }, 'test');
    const fragment = base.getFragment();
    assert.equal(fragment instanceof DocumentFragment, true);
    assert.equal(fragment.textContent, '');
  });

  /**
   * @test {Base#getFragment}
   */
  it('Complex fragment composition', () => {
    // Prepare the template
    const spy = new Spy();
    spy.intercept(FragmentBuilder, 'get', () => {
      const template = document.createElement('div');
      template.innerHTML = '<div class="class">TEST</div>';

      const fragment = document.createDocumentFragment();
      fragment.appendChild(template);
      return fragment;
    });

    let base = new Base({ data: {} }, 'test');
    const fragment = base.getFragment();

    assert.equal(fragment.textContent, 'TEST');
    assert.equal(fragment.querySelectorAll('.class').length, 1);
    FragmentBuilder.get.restore();
  });

  /**
   * @test {Base#renderLocators}
   */
  it('Render locators', () => {
    // Prepare the template
    const spy = new Spy();
    spy.intercept(FragmentBuilder, 'get', () => {
      const template = document.createElement('div');
      template.innerHTML = '<div class="class"></div><p class="class2"></p>';

      const fragment = document.createDocumentFragment();
      fragment.appendChild(template);
      return fragment;
    });

    const locators = [{
      selector: '.class',
      value: 'this is a test'
    },
    {
      selector: '.class2',
      attributes: {
        id: 'my identifier'
      }
    }];

    let base = new Base({ locators, data: {} });
    const fragment = base.getFragment();

    assert.equal(fragment.textContent, locators[0].value);
    assert.equal(fragment.querySelector('.class2').id, locators[1].attributes.id);

    FragmentBuilder.get.restore();
  });

  /**
   * @test {Base#group}
   */
  it('Group fragment content', () => {
    // Prepare the template
    const spy = new Spy();
    spy.intercept(FragmentBuilder, 'get', () => {
      const template = document.createElement('div');
      template.innerHTML = `<div class="dynamic_dom">
         <div class="integer">INT1</div>
         <div class="button">BTN1</div>
         <div class="integer">INT2</div>
         <div class="button">BTN2</div>
        </div>`;

      const fragment = document.createDocumentFragment();
      fragment.appendChild(template);
      return fragment;
    });

    let base = new Base({
      locators: [],
      data: {},
      groups: [
        {
          wrapperClass: 'wrapper',
          start: '.integer',
          end: '.button'
        }
      ]
    });

    const fragment = base.getFragment();
    assert.notEqual(fragment.querySelector('.wrapper'), null);

    const groups = fragment.querySelectorAll('.wrapper');
    assert.equal(groups.length, 2);
    assert.equal(groups[0].querySelector('.integer').innerHTML, 'INT1');
    assert.equal(groups[0].querySelector('.button').innerHTML, 'BTN1');
    assert.equal(groups[1].querySelector('.integer').innerHTML, 'INT2');
    assert.equal(groups[1].querySelector('.button').innerHTML, 'BTN2');

    FragmentBuilder.get.restore();
  });
});
