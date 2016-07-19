'use strict';

import assert from 'assert';
import BaseView from '../../../../src/javascript/component/base/base-view';
import DOMUtil from '../../../../src/javascript/test-framework/dom-util';
import jsdom from 'mocha-jsdom';
import Spy from '../../../../src/javascript/test-framework/spy';
import Environment from '../../../../src/javascript/environment';
import ERBTemplating from '../../../../src/javascript/erb-templating';

/**
 * @test {BaseView}
 */
describe('BaseView', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  /**
   * @method beforeEach
   * @private
   */
  afterEach(() => {
    Environment.environment = Environment.PRODUCTION;
  });

  /**
   * @method overrideDomSelector
   * @param  {String} selector
   * @return {Object}
   * @private
   */
  /* eslint-disable arrow-body-style */
  const overrideDomSelector = (selector) => {
    return {
      replaceWith: (template) => {
        const element = document.getElementById(selector);
        const parent = element.parentElement;
        parent.removeChild(element);
        parent.innerHTML += template;
      }
    };
  };
  /* eslint-enable arrow-body-style */

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
    BaseView.prototype.locators = {
      label: {
        id: '#button',
        event: 'click'
      }
    };
    BaseView.prototype.onLabelClick = () => {};
    const view = new BaseView();

    checkAugmentation(view, 'onLabelClick', () => DOMUtil.sendClickEvent('button'));
  });

  it('has a $ property', () => {
    const baseView = new BaseView();
    assert.equal(typeof baseView.$, 'function');
  });

  /**
   * @test {BaseView#loadTemplate}
   */
  it('Autoloads the template in the development environment', () => {
    const rawTemplate = '<div id="button_template"></div>';
    BaseView.prototype._template = ERBTemplating.filter(rawTemplate);
    const baseView = new BaseView({ locator: 'button' });
    const spy = new Spy();
    spy.intercept(baseView, '$', overrideDomSelector);

    Environment.environment = Environment.DEVELOPMENT;
    assert.equal(Environment.isDevelopment(), true);
    baseView._loadTemplate();
    assert.notEqual(document.getElementById('button_template'), null);
    assert.equal(baseView.$.counter, 1);
  });
});
