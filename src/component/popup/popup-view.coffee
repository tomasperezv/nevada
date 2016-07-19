'use strict'

BaseView = require('../../javascript/component/base/base-view').default
Overlay = require('../overlay/overlay-controller.coffee').default
require('!style!css!less!./main.less')

class PopupView extends BaseView

  locators:
    main: '#popup'
    close:
      id: '[data-where=close_modal]'
      event: 'click'
    show:
      id: '[data-where=trigger]'
      event: 'click'
    header: '.m_popup_with_header'

  constructor: (options) ->
    super(options)

    @element = @$(@locators.main)
    if @element.data('modal')
      @overlay = new Overlay()

  show: () =>
    if @element.hasClass 'hidden'
      @element.removeClass 'hidden'
      @$('body').css 'overflow', 'hidden'

    @$(@locators.header).removeClass('hidden')

    if @overlay? then @overlay.show(true)

  close: () =>
    @element.addClass 'hidden'
    @$('body').css 'overflow', 'visible'

    if @overlay? then @overlay.hide()

module.exports = PopupView
