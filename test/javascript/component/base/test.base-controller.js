'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';
import Spy from '../../../../src/javascript/test-framework/spy';
import BaseController from '../../../../src/javascript/component/base/base-controller';
import BaseControllerView from '../../../../src/javascript/component/base/base-controller-view';
import EventBus from '../../../../src/coffeescript/event_bus.coffee';
import DOMUtil from '../../../../src/javascript/test-framework/dom-util';

/**
 * @test {BaseController}
 */
describe('BaseController', () => {
  // Initialize the DOM
  jsdom();

  afterEach(() => {
    EventBus.clear();

    if (typeof BaseController.prototype._getViewInstance.restore === 'function') {
      BaseController.prototype._getViewInstance.restore();
    }
  });

  /**
   * Spies controller rendering logic
   * @param {Boolean} render
   * @param {Function} callback
   * @private
   */
  const mockCustomView = (render, callback) => {
    const spy = new Spy();
    const mock = spy.mock(new BaseControllerView());
    spy.intercept(BaseController.prototype, '_getViewInstance', () => mock);
    const baseController = new BaseController({ render });
    callback(spy, baseController);
    spy.restore(mock);
  };

  it('A state id is generated', (done) => {
    mockCustomView(true, (spy) => {
      spy.intercept(Math, 'random', () => 0.1234);
      const baseController = new BaseController();
      assert.equal(Math.random.called, true);
      assert.equal(typeof baseController._stateId, 'string');
      assert.equal(baseController._stateId, 'BaseController0.1234');
      Math.random.restore();
      done();
    });
  });

  it('With a document window a store is initialized', (done) => {
    const baseController = new BaseController();
    assert.equal(typeof baseController._store, 'object');
    assert.equal(typeof baseController._store.subscribe, 'function');
    assert.equal(typeof baseController._store.getState, 'function');
    assert.equal(typeof baseController._store.replaceReducer, 'function');
    done();
  });

  it('renders a view on initialization', (done) => {
    mockCustomView(true, (spy) => {
      assert.equal(spy.get('render').count, 1);
      done();
    });
  });

  it('doesn\'t render a view on initialize', (done) => {
    mockCustomView(false, (spy) => {
      assert.equal(spy.get('render'), undefined);
      done();
    });
  });

  it('renders a view on demand', (done) => {
    mockCustomView(false, (spy, baseController) => {
      baseController.render();
      assert.equal(spy.get('render').count, 1);
      done();
    });
  });

  it('generates properly a view name based on controller\'s class name', (done) => {
    const baseController = new BaseController({ render: false });
    assert.equal(baseController._getViewImportName(), 'base-controller-view');
    done();
  });

  it('has a view', () => {
    const baseController = new BaseController();
    const view = baseController.getView();
    assert.equal(typeof view, 'object');
  });

  it('renders emits a renderBaseController event', (done) => {
    EventBus.subscribe('renderBaseController', (eventData) => {
      assert.notEqual(typeof eventData, 'undefined');
      assert.equal(eventData.id, 'BaseController');
      done();
    });

    const baseController = new BaseController(); // eslint-disable-line no-unused-vars
  });

  it('State changes are propagated', () => {
    // Initialize the dom structure
    const div = document.createElement('div');
    div.id = 'button';
    document.getElementsByTagName('body')[0].appendChild(div);

    BaseControllerView.prototype.locators = {
      show: {
        id: '#button',
        event: 'click'
      }
    };

    const baseController = new BaseController();
    baseController._view._controller = baseController;
    DOMUtil.sendClickEvent('button');
    const state = baseController._store.getState();
    assert.equal(state[baseController._stateId].status, 'show');
  });
});
