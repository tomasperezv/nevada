'use strict'

BaseController = require('../../javascript/component/base/base-controller').default

class LoaderController extends BaseController
  constructor: (components, trigger) ->
    super({ id: 'Loader' , loadView: false })
    @_components = components
    if trigger?
      trigger._view.trigger = =>
        @render()
    else
      @render()

  render: ->
    for componentObject in @_components
      componentClass = ModuleJS.require("#{componentObject.id}Controller")
      component = new componentClass({ locator: componentObject.locator })
      if componentObject.action?
        component[componentObject.action]()

module.exports = LoaderController
