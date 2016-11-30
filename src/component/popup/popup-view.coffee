'use strict'

BaseView = require('../../javascript/component/base/base-view').default
Overlay = require('../overlay/overlay-controller.coffee').default
require('!style!css!less!./main.less')

class PopupView extends BaseView
  # @method constructor
  # @param {Object} options
  constructor: (options) ->
    @locators =
      close:
        id: options.locator + " [data-where='close_modal']"
        event: 'click'
      show: options.locator + " [data-where='trigger']"
      header: '.m_popup_with_header'

    super(options)

    @element = @$(options.locator)
    if @element.data('modal')
      @overlay = new Overlay()

  # @method show
  # @public
  show: =>
    if @element.hasClass 'hidden'
      @element.removeClass 'hidden'
      @$('body').css 'overflow', 'hidden'

    @$(@locators.header).removeClass('hidden')

    if @overlay? then @overlay.show(true)

  # @method close
  # @public
  close: =>
    @element.addClass 'hidden'
    @$('body').css 'overflow', 'visible'

    if @overlay? then @overlay.hide()

module.exports = PopupView
