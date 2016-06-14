'use strict';

import jsdom from 'mocha-jsdom';
import assert from 'assert';
import EventActions from '../../../../src/javascript/component/base/event-actions';
import Spy from '../../../../src/javascript/test-framework/spy';
import DOMUtil from '../../../../src/javascript/test-framework/dom-util';
import BaseControllerView from '../../../../src/javascript/component/base/base-controller-view';

/**
 * @test {EventActions}
 */
describe('EventActions', () => {
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
    const mockView = spy.mock(targetView);
    constructDom();
    assert.equal(spy.get('onButtonClick'), null);

    const eventActions = new EventActions();
    eventActions.augment(mockView);
    eventDispatch();

    assert.equal(spy.get(eventListenerMethod).count, 1);
    spy.restore(mockView);
  };

  it('Returns proper event action names', () => {
    const eventActions = new EventActions();
    assert.equal(eventActions._getEventListenerName('click', 'Button'), 'onButtonClick');
    assert.equal(eventActions._getEventListenerName('keypress', 'Label'), 'onLabelKeypress');
    assert.equal(eventActions._getEventListenerName('keypress', 'label'), 'onLabelKeypress');
  });

  it('Augments views based on locators', () => {
    const view = new BaseControllerView();
    view.locators = {
      Button: '#button'
    };
    view.onButtonClick = () => {};

    checkAugmentation(view, 'onButtonClick', () => DOMUtil.sendClickEvent.bind(DOMUtil)('button'));
  });

  it('Augments views based on generic events', () => {
    const view = new BaseControllerView();
    view.locators = {
      Button: '#button'
    };
    view.onResize = () => {};

    checkAugmentation(view, 'onResize', DOMUtil.sendResizeEvent.bind(DOMUtil));
  });

  it('Clears event handlers', () => {
    const view = new BaseControllerView();
    view.locators = {
      Button: '#button'
    };
    view.onButtonClick = () => {};

    const spy = new Spy();
    spy.intercept(view, 'onButtonClick');
    constructDom();

    const eventActions = new EventActions();
    eventActions.augment(view);
    DOMUtil.sendClickEvent('button');
    assert.equal(view.onButtonClick.counter, 1);

    eventActions.clear(view);
    DOMUtil.sendClickEvent('button');
    assert.equal(view.onButtonClick.counter, 1);
    view.onButtonClick.restore();
  });

  it('Translates locator object/strings', () => {
    const eventActions = new EventActions();
    assert.equal(eventActions._getLocatorString('test'), 'test');
    assert.equal(eventActions._getLocatorString({ id: 'test' }), 'test');
  });
});
