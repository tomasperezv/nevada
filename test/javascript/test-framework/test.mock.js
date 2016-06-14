'use strict';

import assert from 'assert';
import Mock from '../../../src/javascript/test-framework/mock.js';

/**
 * @test {Mock}
 */
describe('Mock', () => {
  /**
   * @type {Mock|null} mock
   */
  var mock = null;

  /**
   * @type {String} mockId
   */
  var mockId = 'mock-test';

  /**
   * @method beforeEach
   * @private
   */
  beforeEach(() => {
    mock = new Mock(mockId);
  });

  /**
   * @method afterEach
   * @private
   */
  afterEach(() => {
    mock = null;
  });

  /**
   * @test {Mock#attach}
   */
  it('#attach should inject a mock in the global scope', () => {
    assert.equal(typeof global[mockId], 'undefined');

    mock.attach();
    assert.equal(typeof global[mockId], 'object');
  });

  /**
   * @test {Mock#destroy}
   */
  it('#destroy should remove a mock from the global scope', () => {
    mock.attach();
    assert.equal(typeof global[mockId], 'object');

    mock.destroy();
    assert.equal(typeof global[mockId], 'undefined');
  });

  /**
   * @test {Mock#get}
   */
  it('#get returns the mocked object', () => {
    assert.equal(mock.mock, null);
  });

  /**
   * @test {Mock#set}
   */
  it('#set sets the mocked object', () => {
    mock.mock = {};
    assert.equal(typeof mock.mock, 'object');
  });
});
