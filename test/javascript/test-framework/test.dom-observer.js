'use strict';

import jsdom from 'mocha-jsdom';
import assert from 'assert';
import DOMMutationFactory from '../../../src/javascript/test-framework/dom-mutation/factory';

/**
 * @test {Mock}
 */
describe('Mock', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  /**
   * @type {Node|null} element
   */
  let element = null;

  /**
   * @type {domMutationFactory|null} observer
   */
  let domMutationObserver = null;

  /**
   * List of attributes we can query to the getMutationData method in a
   * DOM mutation API observer.
   *
   * @type {Object} mutationAttributes
   * @private
   */
  const mutationAttributes = [
    'type',
    'removedNodes',
    'attributes',
    'characterData',
    'childList',
    'attributeName',
    'newValue',
    'oldValue'
  ];

  /**
   * @method constructDom
   * @private
   */
  const constructDom = () => {
    // Initialize the dom structure
    const div = document.createElement('div');
    div.id = 'test';
    div.setAttribute('test-attribute', 'old-value');
    document.getElementsByTagName('body')[0].appendChild(div);
    element = document.getElementById('test');
  };

  /**
   * @param {Node} nodeElement
   * @param {String} id
   * @method insertChildNode
   * @private
   */
  const insertChildNode = (nodeElement, id) => {
    const newElement = document.createElement('div');
    newElement.id = id;
    nodeElement.appendChild(newElement);

    return newElement;
  };

  /**
   * Modifies a DOM element
   * @method mutateDom
   * @private
   */
  const mutateDom = () => {
    element.setAttribute('test-attribute', 'new-value');
  };

  /**
   * @method beforeEach
   * @private
   */
  beforeEach(() => {
    domMutationObserver = DOMMutationFactory.get();
    constructDom();
  });

  /**
   * @method afterEach
   * @private
   */
  afterEach(() => {
    domMutationObserver.restore();
    document.body.removeChild(element);
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#observer}
   */
  it('domMutation#observe throws error if trying to observe invalid element.', () => {
    const throwAnException = function() {
      domMutationObserver.observe(null);
    };

    assert.throws(throwAnException, Error);
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData with no mutation returns undefined for every attribute.', () => {
    domMutationObserver.observe(element);
    mutationAttributes.map((attributeKey) => {
      assert.equal(domMutationObserver.getMutationData(attributeKey), undefined);
    });
  });

  /**
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData with no observe and no mutation returns undefined attributes.', () => {
    mutationAttributes.map((attributeKey) => {
      assert.equal(domMutationObserver.getMutationData(attributeKey), undefined);
    });
  });

  /**
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData with no observe returns undefined for every attribute.', () => {
    mutationAttributes.map((attributeKey) => {
      assert.equal(domMutationObserver.getMutationData(attributeKey), undefined);
    });
  });

  /**
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData DOM mutation without observe returns undefined for attributes.', () => {
    mutateDom();

    mutationAttributes.map((attributeKey) => {
      assert.equal(domMutationObserver.getMutationData(attributeKey), undefined);
    });
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#isActive tracks properly if a DOM element is being observed', (done) => {
    assert.equal(domMutationObserver.isActive(), false);
    domMutationObserver.observe(element).then(() => {
      assert.equal(domMutationObserver.isActive(), true);
      done();
    });

    mutateDom();
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData DOM mutation in existing attribute is detected.', (done) => {
    domMutationObserver.observe(element).then(() => {
      assert.equal(domMutationObserver.getMutationData('type'), 'attributes');
      assert.equal(domMutationObserver.getMutationData('newValue'), 'new-value');
      assert.equal(domMutationObserver.getMutationData('oldValue'), 'old-value');
      assert.equal(domMutationObserver.getMutationData('attributeName'), 'test-attribute');
      done();
    });

    mutateDom();
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData DOM mutation in new attribute is detected.', (done) => {
    const value = 'new-value-for-new-attribute';
    domMutationObserver.observe(element).then(() => {
      assert.equal(domMutationObserver.getMutationData('type'), 'attributes');
      assert.equal(domMutationObserver.getMutationData('newValue'), value);
      assert.equal(domMutationObserver.getMutationData('oldValue'), null);
      done();
    });

    element.setAttribute('newAttribute', value);
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData DOM mutation adding a node.', (done) => {
    const id = 'new-element-id';
    domMutationObserver.observe(element).then(() => {
      assert.equal(domMutationObserver.getMutationData('type'), 'childList');
      assert.equal(domMutationObserver.getMutationData('element').id, id);
      done();
    });

    insertChildNode(element, id);
  });

  /**
   * @test {DomObserver#observe}
   * @test {DomObserver#getMutationData}
   */
  it('domMutation#getMutationData DOM mutation removing a node.', (done) => {
    const id = 'new-element-id';

    // Start observing and now remove child element
    domMutationObserver.observe(element).then(() => {
      assert.equal(domMutationObserver.getMutationData('type'), 'childList');
      assert.equal(domMutationObserver.getMutationData('element').id, id);
      done();
    });

    const childNode = insertChildNode(element, id);
    childNode.parentElement.removeChild(childNode);
  });
});
