'use strict'

BaseController = require('../../javascript/component/base/base-controller').default

class PopupController extends BaseController
  # @method constructor
  # @param {Object} options
  constructor: (options) ->
    options.id = 'Popup'
    super(options)

  # @method show
  # @public
  show: ->
    @_store.dispatch({ type: 'show' })

  # @method close
  # @public
  close: ->
    @_store.dispatch({ type: 'close' })

module.exports = PopupController
