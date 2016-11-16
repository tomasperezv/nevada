'use strict';

import assert from 'assert';
import Position from '../../src/javascript/dom/position';
import jsdom from 'mocha-jsdom';
import Spy from '../../src/javascript/test-framework/spy';

describe('Position', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom({ skipWindowCheck: true });

  /**
   * @type {sourceElement|null} sourceElement
   */
  let sourceElement = null;

  /**
   * @type {sourceDOMRect|null} sourceElement
   */
  let sourceDOMRect = null;

  /**
   * @type {relativeDOMRect|null} sourceElement
   */
  let relativeDOMRect = null;

  /**
   * @method beforeEach
   * @private
   */
  beforeEach(() => {
    sourceDOMRect = {
      top: 1,
      bottom: 5,
      left: 1,
      right: 7,
      height: 4,
      width: 6
    };

    relativeDOMRect = {
      top: -12,
      bottom: 1000,
      left: 0,
      right: 1000,
      height: 1012,
      width: 1000
    };

    sourceElement = document.createElement('div');

    const spy = new Spy();

    spy.intercept(sourceElement, 'getBoundingClientRect', () => {
      return sourceDOMRect;
    });

    spy.intercept(document.body, 'getBoundingClientRect', () => {
      return relativeDOMRect;
    });
  });

  /**
   * @test {Position#constructor}
   */
  it("It throws exception 'An Element must be passed as argument' if element is Element node type", () => {
    assert.throws(() => new Position('test'),
      Error, 'An Element must be passed as argument');
  });

  /**
   * @test {Position#relativeGet}
   */
  it("relativeGet throws exception 'Relative element must have Document or Element node type' " +
     "if element is not Document or Element node type", () => {
    const position = new Position(sourceElement);

    assert.throws(() => position.relativeGet('test'),
      Error, 'Relative element must have Document or Element node type');
  });

  /**
   * @test {Position#relativeGet}
   */
  it("relativeGet returns correct absolute position", () => {
    const position = new Position(sourceElement);
    const resultDOMRect = position.relativeGet();

    assert.equal(resultDOMRect.top, sourceDOMRect.top - relativeDOMRect.top);
    assert.equal(resultDOMRect.bottom, sourceDOMRect.bottom - relativeDOMRect.bottom);
    assert.equal(resultDOMRect.left, sourceDOMRect.left - relativeDOMRect.left);
    assert.equal(resultDOMRect.right, sourceDOMRect.right - relativeDOMRect.right);
  });

  /**
   * @test {Position#relativeGet}
   */
  it("relativeGet doesn't take into account height/width relative element properties", () => {
    const position = new Position(sourceElement);
    const resultDOMRect = position.relativeGet();

    assert.equal(resultDOMRect.width, sourceElement.width);
    assert.equal(resultDOMRect.height, sourceElement.height);
  });
});
