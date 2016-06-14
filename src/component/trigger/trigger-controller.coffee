'use strict'

BaseController = require('../../javascript/component/base/base-controller').default
BaseView = require('../../javascript/component/base/base-controller-view').default

class TriggerController extends BaseController
  constructor: (options) ->
    super({ id: 'Trigger', locator: options.locator })

  _getViewInstance: ->
    return new BaseView({
      controller: @
      locators: {
        trigger: {
          id: @_options.locator
          event: @_options.event || 'click'
        }
      }
    })

module.exports = TriggerController
