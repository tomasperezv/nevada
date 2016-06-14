'use strict'

BaseView = require('../../javascript/component/base/base-controller-view').default
require('!style!css!less!./main.less')

class OverlayView extends BaseView
  constructor: (options) ->
    super(options)
    @locators = {
      Overlay: '[data-where=page_overlay]'
    }

  show: (overHeader) ->
    unless @$(@locators.Overlay).length > 0
      @$('body').append @$('<div/>',
        class: 'page_overlay'
        'data-where': 'page_overlay'
      )

    if overHeader
      @$(@locators.Overlay).addClass('over_header')

  hide: ->
    @$(@locators.Overlay).remove()

module.exports = OverlayView
