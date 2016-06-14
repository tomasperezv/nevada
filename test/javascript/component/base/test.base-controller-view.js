'use strict';

import assert from 'assert';
import BaseControllerView from '../../../../src/javascript/component/base/base-controller-view';
import DOMUtil from '../../../../src/javascript/test-framework/dom-util';
import jsdom from 'mocha-jsdom';
import Spy from '../../../../src/javascript/test-framework/spy';

/**
 * @test {BaseControllerView}
 */
describe('BaseControllerView', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  /**
   * @method constructDom
   */
  const constructDom = () => {
    // Initialize the dom structure
    const div = document.createElement('div');
    div.id = 'button';
    document.getElementsByTagName('body')[0].appendChild(div);
  };

  /**
   * @method checkAugmentation
   */
  const checkAugmentation = (targetView, eventListenerMethod, eventDispatch) => {
    const spy = new Spy();
    spy.intercept(targetView, 'onLabelClick');
    targetView._attachEvents();
    assert.equal(targetView.onLabelClick.counter, 0);
    eventDispatch();

    assert.equal(targetView.onLabelClick.counter, 1);
    targetView.onLabelClick.restore();
  };

  it('Gets augmented via EventActions', () => {
    constructDom();
    BaseControllerView.prototype.locators = {
      label: {
        id: '#button',
        event: 'click'
      }
    };
    BaseControllerView.prototype.onLabelClick = () => {};
    const view = new BaseControllerView();

    checkAugmentation(view, 'onLabelClick', () => DOMUtil.sendClickEvent('button'));
  });

  it('has a $ property', () => {
    const baseView = new BaseControllerView();
    assert.equal(typeof baseView.$, 'function');
  });
});
