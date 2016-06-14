'use strict';

const assert = require('assert');

/**
 * @test {ModuleJS}
 */
describe('ModuleJS', () => {
  /**
   * @type {Object|null| ModuleJS
   */
  var ModuleJS = null;

  class TestModule {
    constructor() {
      this.id = 'test';
    }
  }

  /**
   * @method beforeEach
   * @private
   */
  beforeEach(() => {
    ModuleJS = require('../../../src/javascript/test-framework/modulejs');
    ModuleJS.attach();
  });

  /**
   * @method afterEach
   * @private
   */
  afterEach(() => {
    ModuleJS = null;
  });

  /**
   * @test {ModuleJS#attach}
   */
  it('#attach intercepts modulejs calls', () => {
    assert.equal(typeof ModuleJS.getModule('Test'), 'undefined');
    ModuleJS.mock.define('TestModule', () => TestModule);
    assert.equal(typeof ModuleJS.getModule('Test'), 'function');
  });

  /**
   * @test {ModuleJS#getModule}
   */
  it('#getModule returns the Module constructor', () => {
    const Module = ModuleJS.getModule('Test');
    const moduleObject = new Module();
    assert.equal(moduleObject.id, 'test');
  });
});
