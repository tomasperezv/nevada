'use strict';

import jsdom from 'mocha-jsdom';
import assert from 'assert';
import EventActions from '../../../../src/javascript/component/base/event-actions';
import Spy from '../../../../src/javascript/test-framework/spy';
import DOMUtil from '../../../../src/javascript/test-framework/dom-util';
import BaseView from '../../../../src/javascript/component/base/base-view';

/**
 * @test {EventActions}
 */
describe('EventActions', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  let view = null;

  beforeEach(() => {
    view = new BaseView();
    view.locators = {
      Button: '#button'
    };

    view.onButtonClick = () => {};
  });

  afterEach(() => {
    view = null;
  });

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
    checkAugmentation(view, 'onButtonClick', () => DOMUtil.sendClickEvent.bind(DOMUtil)('button'));
  });

  it('Augments views based on generic events', () => {
    view.onResize = () => {};
    checkAugmentation(view, 'onResize', DOMUtil.sendResizeEvent.bind(DOMUtil));
  });

  it('Clears event handlers', () => {
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

  it('Event handlers receive the event object', (done) => {
    const eventActions = new EventActions();

    view.onButtonClick = (e) => {
      assert.equal(e instanceof Event, true);
      assert.equal(e.isTrusted, false);
      eventActions.clear(view);
      done();
    };

    constructDom();

    eventActions.augment(view);
    DOMUtil.sendClickEvent('button');
  });

  it('Object locators receive the event object', (done) => {
    view.locators = {
      Button: {
        id: '#button',
        handler: (e) => {
          assert.equal(e instanceof Event, true);
          assert.equal(e.isTrusted, false);
          done();
        }
      }
    };

    constructDom();

    const eventActions = new EventActions();
    eventActions.augment(view);

    DOMUtil.sendClickEvent('button');
  });

  it('Translates locator object/strings', () => {
    const eventActions = new EventActions();
    assert.equal(eventActions._getLocatorString('test'), 'test');
    assert.equal(eventActions._getLocatorString({ id: 'test' }), 'test');
  });
});
