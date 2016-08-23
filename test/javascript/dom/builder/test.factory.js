'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';
import { Factory } from '../../../../src/javascript/dom/builder/factory';
import Type from '../../../../src/javascript/dom/builder/type';
import Spy from '../../../../src/javascript/test-framework/spy';

/**
 * @test {FragmentFactory}
 */
describe('FragmentFactory', () => {

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

  /**
   * @test {FragmentFactory#create}
   */
  it('The factory can instantiate field types', () => {
    const field = Factory.create({ id: '#test', data: {}, type: Type.Form });
    _verifyFieldElement(field, 'Form');
  });

  /**
   * @test {FragmentFactory#create}
   */
  it('The factory returns fallback element when the id is not found', () => {
    const field = Factory.create({ data: {}, type: 'invalid-type' });
    _verifyFieldElement(field, 'String');
  });

  /**
   * @test {FragmentFactory#create}
   */
  it('We can define a fallback parameter', () => {
    const field = Factory.create({ fallback: Type.Checklist, data: {}, type: 'invalid-type' });
    _verifyFieldElement(field, 'Checklist');
  });

  /**
   * @test {FragmentFactory#_instantiate}
   */
  it('Delegating component instatiation', () => {
    const field = Factory._instantiate({ data: {}, type: Type.String });
    _verifyFieldElement(field, 'String');
  });

  /**
   * @test {FragmentFactory#intercept}
   */
  it('We can intercept decorator parameters', (done) => {
    _spy.intercept(Factory, '_instantiate', (params) => {
      assert.notEqual(typeof params.decorators, 'undefined');
      assert.equal(params.decorators.test, 'test');
      done();
    });

    Factory.intercept(Type.Form, { test: 'test' });
    assert.equal(Factory._intercepts[Type.Form].test, 'test');

    Factory.create({ id: '#test', data: {}, type: Type.Form });
  });
});
