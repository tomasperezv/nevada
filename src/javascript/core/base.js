'use strict';

/**
 * Webpack module loader
 * Defines the list of base files that are used by all of the core bundles
 * @module base
 */

// core-js polyfills
require('core-js/modules/es6.object.assign');
require('core-js/modules/es6.object.create');
require('core-js/modules/es6.object.keys');
require('core-js/modules/es6.object.define-property');
require('core-js/modules/es6.object.get-prototype-of.js');
require('core-js/modules/es6.map');
require('core-js/modules/es6.array.for-each.js');
require('core-js/modules/es6.array.filter.js');
require('core-js/modules/es6.array.is-array.js');
require('core-js/modules/es6.array.reduce.js');
require('core-js/modules/es6.array.every');
require('core-js/modules/es6.array.map.js');
require('core-js/modules/es6.array.index-of.js');
require('core-js/modules/es6.function.bind.js');
require('core-js/modules/es6.date.now');
require('core-js/modules/es6.promise');

// ModuleJS modules
const ModuleJS = require('@lrsjng/modulejs');
const BaseController = require('../component/base/base-controller').default;
const BaseView = require('../component/base/base-view').default;
const CookieStorage = require('../cookie-storage').default;
const CloneObject = require('../clone-object').default;
const Environment = require('../environment').default;
const Position = require('../dom/position').default;
const DelayedDisplayPool = require('../delayed-display-pool').default;

// @see ../dom/builder
ModuleJS.define('Builder/Factory', () => require('../dom/builder/factory').Factory);
ModuleJS.define('Builder/Type', () => require('../dom/builder/type').default);

ModuleJS.define('EventBusModule', () => require('../../coffeescript/event_bus.coffee'));
ModuleJS.define('LoggerModule', () => require('../../coffeescript/logger.coffee'));
ModuleJS.define('BaseController', () => BaseController);
ModuleJS.define('BaseView', () => BaseView);
ModuleJS.define('CookieStorage', () => CookieStorage);
ModuleJS.define('CloneObject', () => CloneObject);
ModuleJS.define('Environment', () => Environment);
ModuleJS.define('Position', () => Position);
ModuleJS.define('DelayedDisplayPool', () => DelayedDisplayPool);

// Exposes the ModuleJS object in the global scope, that way
// we can preserve compatibility with the current projects.
window.ModuleJS = window.modulejs = ModuleJS;
