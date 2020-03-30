import findPlugins from 'find-plugins'
import CliBumpStrategy from './version-strategy/CliBumpStrategy'
import { IVersionBump } from './interfaces'
import StrategyPlugin = IVersionBump.StrategyPlugin

const PKG_REGEX = /(.*)?version-bump-plugin(.*)/

export default class StrategyLoader {
  private strategies: {
    [strategyName: string]: {
      Strategy: StrategyPlugin
    }
  }

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

  strategyExists (name) {
    return this.strategies[name] !== undefined
  }

  getStrategyConstructor (name) {
    if (!this.strategies[name]) {
      throw new Error('Version bump strategy not found: ' + name)
    }

    return this.strategies[name].Strategy
  }

  /**
   * Registers a strategy.
   */
  registerStrategy = (Strategy: StrategyPlugin) => {
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
    const plugins = findPlugins({
      filter: function (data) {
        return PKG_REGEX.test(data.pkg.name)
      },
      includeDev: true
    })

    plugins.forEach(pluginData => {
      const plugin = require(pluginData.dir)
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
