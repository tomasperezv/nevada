import assert from 'assert';

import Position from '../../src/javascript/position';
import jsdom from 'mocha-jsdom';
import Spy from '../../src/javascript/test-framework/spy';

describe('Position', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom({ skipWindowCheck: true });

  /**
   * @type {sourceElement|null} sourceElement
   */
  let sourceElement = null;
  let sourceDOMRect = null;
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
   * @test {Position#relativeGet}
   */
  it("relativeGet returns correct absolute position", () => {
    let resultDOMRect = Position.relativeGet(sourceElement, document.body);

    assert.equal(resultDOMRect.top, sourceDOMRect.top - relativeDOMRect.top);
    assert.equal(resultDOMRect.bottom, sourceDOMRect.bottom - relativeDOMRect.bottom);
    assert.equal(resultDOMRect.left, sourceDOMRect.left - relativeDOMRect.left);
    assert.equal(resultDOMRect.right, sourceDOMRect.right - relativeDOMRect.right);
  });

  /**
   * @test {Position#relativeGet}
   */
  it("relativeGet doesn't take into account height/width relative element properties", () => {
    let resultDOMRect = Position.relativeGet(sourceElement, document.body);

    assert.equal(resultDOMRect.width, sourceElement.width);
    assert.equal(resultDOMRect.height, sourceElement.height);
  });
});
