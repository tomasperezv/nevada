'use strict'
class Logger

  levels = ['debug', 'info', 'warn', 'error']

  constructor: (level) ->
    @_ensureConsoleLog()
    @verbose_level = level || 'debug'

  @fromEnvironment: (level = 'info') ->
    Environment = require '../javascript/environment'
    if Environment.isDevelopment
      'debug'
    else
      'warn'

    new Logger(level)

  getConsole: ->
    console

  verbose: (level) ->
    levels.indexOf(@verbose_level) <= levels.indexOf(level)

  debug: (msg, opts...) ->
    console = @getConsole()
    if @verbose('debug')
      console.log "[DEBUG] #{msg}", opts

  info: (msg, opts...) ->
    console = @getConsole()
    if @verbose('info')
      console.log "[INFO] #{msg}", opts

  warn: (msg, opts...) ->
    console = @getConsole()
    if @verbose('warn')
      console.log "[WARN] #{msg}", opts

  error: (msg, opts...) ->
    console = @getConsole()
    if @verbose('error')
      console.log "[ERROR] #{msg}", opts

  _ensureConsoleLog: ->
    unless window.console
      window.console = {}
      window.console.log = ->

module.exports = Logger
