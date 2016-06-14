'use strict'

BaseController = require('../../javascript/component/base/base-controller').default

class PopupController extends BaseController
  constructor: (options) ->
    options.id = 'Popup'
    super(options)

  show: ->
    @_store.dispatch({ type: 'show' })

  close: ->
    @_store.dispatch({ type: 'close' })

module.exports = PopupController
