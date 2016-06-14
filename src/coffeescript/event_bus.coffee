'use strict'

class EventBus

  subscribers: {
  }

  clear: ->
    @subscribers = {}

  publish: (name, data) ->
    if @subscribers[name]?
      for listener in @subscribers[name]
        listener(data)

  subscribe: (name, listener) ->
    if typeof listener is 'function'
      if @subscribers[name]? then @subscribers[name].push listener else @subscribers[name] = [listener]
    else
      throw new Error("Listener in subscribe method must be a function")

module.exports = new EventBus
