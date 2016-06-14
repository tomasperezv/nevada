/**
 * Webpack module loader
 * @module unit-test framework
 */
import ModuleJS from './modulejs';
import Mock from './mock';
import Spy from './spy';
import DOMUtil from './dom-util';

// Exposes the ModuleJS object in the global scope, that way
// we can preserve compatibility with the current projects.
ModuleJS.attach();

/* global modulejs */
modulejs.define('MockModule', () => Mock);
modulejs.define('SpyModule', () => Spy);
modulejs.define('DOMUtilModule', () => DOMUtil);
