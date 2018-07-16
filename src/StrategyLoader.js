import loadDeps from 'load-deps'

import CliBumpStrategy from './version-strategy/CliBumpStrategy'

export default class StrategyLoader {
  constructor () {
    this.strategies = {}
    this._loadExternalPlugins()
    this.registerStrategy({
      Constructor: CliBumpStrategy
    })
  }

  /**
   *
   * @return {object}
   */
  getStrategies () {
    return this.strategies
  }

  getStrategyConstructor (name) {
    if (!this.strategies[name]) {
      throw new Error('Version bump strategy not found: ' + name)
    }

    return this.strategies[name].Constructor
  }

  /**
   * Registers a strategy.
   * @param {BaseVersionStrategy} fn A class that extends BaseVersionStrategy
   */
  registerStrategy ({ Constructor } = {}) {
    if (!Constructor.strategyShortName) {
      throw new Error('strategyShortName not defined for strategy: ' + Constructor.toString())
    }

    const name = Constructor.strategyShortName

    this.strategies[name] = {
      Constructor
    }
  }

  _loadExternalPlugins () {
    const plugins = loadDeps('version-bump-plugin')

    Object.keys(plugins).forEach((plugin) => {
      // check if each plugin has the getStrategies fn
      // call it to add the strategies
      if (plugin.getStrategies) {
        const strats = plugin.getStrategies()

        strats.forEach((strat) => {
          if (typeof strat === 'object') {
            this.registerStrategy(strat)
          }
        })
      }
    })
  }
}
