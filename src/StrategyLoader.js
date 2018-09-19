import loadDeps from 'load-deps'

import CliBumpStrategy from './version-strategy/CliBumpStrategy'

export default class StrategyLoader {
  constructor () {
    this.strategies = {}
    this._loadExternalPlugins()
    this.registerStrategy(CliBumpStrategy)
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

    return this.strategies[name].Strategy
  }

  /**
   * Registers a strategy.
   * @param {BaseVersionStrategy} fn A class that extends BaseVersionStrategy
   */
  registerStrategy = Strategy => {
    if (Strategy && !Strategy.strategyShortName) {
      throw new Error(
        'strategyShortName not defined for strategy: ' + Strategy.name
      )
    }

    const name = Strategy.strategyShortName

    this.strategies[name] = {
      Strategy
    }
  }

  _loadExternalPlugins () {
    const plugins = loadDeps([
      '*/version-bump-plugin-*',
      'version-bump-plugin-*'
    ])

    Object.keys(plugins).forEach(module => {
      const plugin = plugins[module]
      // check if each plugin has the getStrategies fn
      // call it to add the strategies
      if (plugin.getStrategies) {
        const strats = plugin.getStrategies()
        strats.forEach(this.registerStrategy)
      } else {
        console.warn(
          'Found plugin, but getStrategies() was not defined for it:',
          module
        )
      }
    })
  }
}
