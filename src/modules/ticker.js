import conf from './config'
import Pair from '../models/pair'
import axios from 'axios'
import moment from 'moment'
import { error, log } from './common'

export default class Ticker {
  constructor () {
    this.now = moment.utc().local().startOf('minute').toDate()
    this.pairs = []
    return this
  }

  init () {
    console.log('[+] initializing')
    return axios.get(conf.route('AssetPairs')).then((response) => {
      this.pairs = Object.keys(response.data.result)
          .filter(k => !k.match(/CAD|JPY|USD|\.d/))
          .map(k => new Pair(response.data.result[k], this.now))
      .catch((err) => {
        error('unhandled exception, exiting')
        error(err)
        process.exit(1)
      })
      return this
    })
  }

  run () {
    console.log('[+] running')
    this.init().then(this.save.bind(this))
    return this
  }

  save () {
    console.log('[+] saving')
    let promises = this.pairs.map(p => p.tick())
    return Promise.all(promises)
      .then((data) => process.exit(0))
  }
}

