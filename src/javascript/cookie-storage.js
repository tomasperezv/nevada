/* @flow */
'use strict';
import Cookie from '@tomasperezv/js-cookie';

/**
 * Adapter object for storing data in cookies without depending on a specific implementation.
 * @module CookieStorage
 * @see https://www.npmjs.com/package/js-cookiethis._storage(id);
 */
class CookieStorage {
  /**
   * @param {String} id
   * @param {String} value
   * @param {Object} props
   * @method set
   */
  set(id: string, value: string, props: Object = {}): void {
    Cookie.set(id, value, props);
  }

  /**
   * @param {String} id
   * @method get
   * @returns {String}
   */
  get(id: string): string {
    return Cookie.get(id);
  }

  /**
   * @param {String} name
   * @method remove
   */
  remove(name: string): void {
    Cookie.remove(name);
  }

  /**
   * @method removeAll
   */
  removeAll(): void {
    const cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      let name = cookies[i].split('=')[0];
      name = name.replace(' ', '');
      Cookie.remove(name);
    }
  }
}

const cookieStorage = new CookieStorage();

export default cookieStorage;
