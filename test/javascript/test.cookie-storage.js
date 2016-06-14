'use strict';

import assert from 'assert';
import jsdom from 'mocha-jsdom';
import CookieStorage from '../../src/javascript/cookie-storage';

/**
 * @test {CookieStorage}
 */
describe('CookieStorage', () => {
  // Initialize the fake DOM that jsdom exposes
  jsdom();

  beforeEach(() => {
    CookieStorage.removeAll();
  });

  /**
   * @test {CookieStorage#set}
   */
  it('Cookie values are set', () => {
    CookieStorage.set('skip_top_bar_ad', 'true', 10);
    assert.equal(document.cookie, 'skip_top_bar_ad=true');
    CookieStorage.removeAll();

    CookieStorage.set('last_session_within_one_day', 'yes', 5);
    assert.equal(document.cookie, 'last_session_within_one_day=yes');
    CookieStorage.removeAll();

    CookieStorage.set('apply_to_job_opening_id', 5, 'session', { path: '/' });
    assert.equal(document.cookie, 'apply_to_job_opening_id=5');
  });

  /**
   * @test {CookieStorage#remove}
   */
  it('Cookies can be removed individually', () => {
    CookieStorage.set('test', 'value');
    assert.equal(document.cookie, 'test=value');
    CookieStorage.remove('test1');
    assert.equal(document.cookie, 'test=value');
    CookieStorage.remove('test');
    assert.equal(document.cookie, '');
  });

  /**
   * @test {CookieStorage#removeAll}
   */
  it('Cookies can be removed globally', () => {
    CookieStorage.set('test1', 'value1');
    CookieStorage.set('test2', 'value2');
    assert.equal(document.cookie, 'test1=value1; test2=value2');
    CookieStorage.remove('test-invalid');
    assert.equal(document.cookie, 'test1=value1; test2=value2');
    CookieStorage.removeAll();
    assert.equal(document.cookie, '');
  });
});
