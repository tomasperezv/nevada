'use strict'

BaseController = require('../../javascript/component/base/base-controller').default

class OverlayController extends BaseController
  constructor: (options) ->
    options.id = 'Overlay'
    super(options)

  show: (overHeader = false) ->
    @_view.show(overHeader)

  hide: ->
    @_view.hide()

module.exports = OverlayController
