'use strict';

import assert from 'assert';
import Environment from '../../src/javascript/environment';

/**
 * @test {Environment}
 */
describe('Environment', () => {
  /**
   * @test {Environment#isDevelopment}
   */
  it('Environment is set to production by default', () => {
    assert.equal(Environment.isDevelopment(), false);
    assert.equal(Environment.environment, Environment.PRODUCTION);
  });

  /**
   * @test {Environment#set}
   */
  it('The environment information can be set', () => {
    assert.equal(Environment.isDevelopment(), false);
    Environment.environment = Environment.DEVELOPMENT;
    assert.equal(Environment.isDevelopment(), true);
    assert.equal(Environment.environment, Environment.DEVELOPMENT);
  });
});
