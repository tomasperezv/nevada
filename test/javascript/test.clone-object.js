'use strict';

import assert from 'assert';
import CloneObject from '../../src/javascript/clone-object';

/**
 * @test {CloneObject}
 */
describe('CloneObject', () => {
  const compareObjects = (sourceObject, clonedObject) => {
    Object.keys(sourceObject).forEach((key) => {
      assert.notEqual(typeof clonedObject[key], 'undefined');
      assert.equal(clonedObject[key], sourceObject[key]);
    });
  };

  /**
   * @test {CloneObject#clone}
   */
  it('Can clone objects', () => {
    let clonedObject = CloneObject.clone({});
    compareObjects({}, clonedObject);

    const sourceObject = {
      a: 1,
      b: 2
    };

    clonedObject = CloneObject.clone(sourceObject);
    compareObjects(sourceObject, clonedObject);
  });

  /**
   * @test {CloneObject#cloneWithout}
   */
  it('Can clone objects properties conditionally', () => {
    const sourceObject = {
      a: 1,
      b: 2
    };

    let clonedObject = CloneObject.cloneWithout(sourceObject, []);
    assert.equal(clonedObject.a, sourceObject.a);
    assert.equal(clonedObject.b, sourceObject.b);

    clonedObject = CloneObject.cloneWithout(sourceObject, ['a']);
    assert.equal(clonedObject.b, sourceObject.b);
    assert.equal(typeof clonedObject.a, 'undefined');
  });
});
