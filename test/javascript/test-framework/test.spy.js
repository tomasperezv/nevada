'use strict';

import assert from 'assert';
import Spy from '../../../src/javascript/test-framework/spy';
import ModuleJS from '@lrsjng/modulejs';

/**
 * @test {Spy}
 */
describe('Spy', () => {
  /**
   * @type {Object} testObject
   */
  const testObject = {
    property: 5,
    method: () => {}
  };

  /**
   * @type {Object|null} spied
   */
  let spied = null;

  /**
   * @type {Spy|null} spied
   */
  let spy = null;

  /**
   * @method beforeEach
   * @private
   */
  beforeEach(() => {
    spy = new Spy();
    spied = spy.watch(testObject);
  });

  /**
   * @method afterEach
   * @private
   */
  afterEach(() => {
    if (spy.watched(testObject, 'method')) {
      testObject.method.restore();
    }
    spy = null;
  });

  /**
   * @method assertSpyRegister
   * @param {Spy} spyObject
   * @param {String} property
   * @param {Object} register
   *   {Boolean} called
   *   {Number} count
   *   {Boolean} isDefined
   */
  const assertSpyRegister = function(spyObject, property, register) {
    Object.keys(register).forEach((key) => {
      assert.equal(spyObject.get(property)[key], register[key]);
    });
  };

  /**
   * @test {Spy#watch}
   */
  it('#spy spied proxy preserves original values', () => {
    assert.equal(spied.property, testObject.property);
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts property sets', () => {
    assert.equal(spy.get('property'), null);

    spied.property = 'test';
    assertSpyRegister(spy, 'property', { called: true, count: 1, isDefined: true });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts invalid property sets', () => {
    spied.fake = 'test';
    assertSpyRegister(spy, 'fake', { called: true, count: 1, isDefined: false });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy counts properly multiple property sets', () => {
    assert.equal(spy.get('property'), null);

    spied.property = 'test-1';
    spied.property = 'test-2';
    assertSpyRegister(spy, 'property', { count: 2 });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts property gets', () => {
    const test = spied.property; // eslint-disable-line no-unused-vars
    assertSpyRegister(spy, 'property', { called: true, count: 1, isDefined: true });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts multiple property sets', () => {
    var test = spied.property; // eslint-disable-line no-unused-vars
    test = spied.property;
    assertSpyRegister(spy, 'property', { count: 2 });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts invalid property sets', () => {
    const test = spied.fake; // eslint-disable-line no-unused-vars
    assertSpyRegister(spy, 'fake', { called: true, count: 1, isDefined: false });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts method calls', () => {
    assert.equal(spy.get('method'), null);

    spied.method();
    assertSpyRegister(spy, 'method', { called: true, count: 1, isDefined: true });
  });

  /**
   * @test {Spy#get}
   */
  it('#spy intercepts multiple method calls', () => {
    assert.equal(spy.get('method'), null);

    spied.method();
    spied.method();
    assertSpyRegister(spy, 'method', { count: 2 });
  });

  /**
   * @test {Spy#intercept}
   */
  it('#intercept overrides method calls', () => {
    assert.equal(typeof testObject.method.called, 'undefined');
    spy.intercept(testObject, 'method');
    assert.notEqual(typeof testObject.method.called, 'undefined');
    assert.equal(testObject.method.called, false);
  });

  /**
   * @test {Spy#intercept}
   */
  it('#intercept registers method calls', () => {
    spy.intercept(testObject, 'method');

    testObject.method();
    assert.equal(testObject.method.called, true);
  });

  /**
   * @test {Spy#intercept}
   */
  it('#intercept counts method calls', () => {
    spy.intercept(testObject, 'method');

    assert.equal(testObject.method.counter, 0);

    testObject.method();
    assert.equal(testObject.method.counter, 1);

    testObject.method();
    assert.equal(testObject.method.counter, 2);
  });

  /**
   * @test {Spy#intercept}
   */
  it('#intercept can receive stubs', () => {
    const stub = () => 'test-result';
    spy.intercept(testObject, 'method', stub);

    assert.equal(testObject.method.counter, 0);

    const result = testObject.method();
    assert.equal(testObject.method.counter, 1);
    assert.equal(result, 'test-result');
  });

  /**
   * @test {Spy#watched}
   */
  it('#watched', () => {
    assert.ok(!spy.watched(testObject, 'method'));
    spy.intercept(testObject, 'method');
    assert.ok(spy.watched(testObject, 'method'));
    assert.equal(typeof testObject.method.called, 'boolean');
  });

  /**
   * @test {Spy#restore}
   */
  it('#instance.method.restore', () => {
    spy.intercept(testObject, 'method');
    testObject.method.restore();
    assert.ok(!spy.watched(testObject, 'method'));
  });

  /**
   * @test {Spy#mock}
   */
  it('#mock can override modulejs modules', () => {
    const obj = {
      property: 5,
      method: () => 'test-value'
    };

    spy.mock(obj, 'testObject', true);
    const mockObject = ModuleJS.require('testObject');

    mockObject.property = 6;
    assert.equal(spy.get('property').called, true);
    assert.equal(spy.get('property').count, 1);
    assert.equal(spy.get('property').isDefined, true);

    mockObject.propertyUnexistent = 6;
    assert.equal(spy.get('propertyUnexistent').called, true);
    assert.equal(spy.get('propertyUnexistent').count, 1);
    assert.equal(spy.get('propertyUnexistent').isDefined, false);

    spy.restore(obj);
    const originalObject = ModuleJS.require('testObject');
    assert.equal(spy.get('property'), null);
    assert.equal(originalObject.property, 5);
  });

  /**
   * @test {Spy#mock}
   */
  it('#mock can restore modulejs modules', () => {
    const obj = {
      property: 5,
      method: () => 'test-value'
    };

    spy.mock(obj, 'testObject', true);
    spy.restore(obj);

    const originalObject = ModuleJS.require('testObject');
    originalObject.property = 10;

    assert.equal(spy.get('property'), null);
  });
});
