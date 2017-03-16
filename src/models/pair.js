import mongo from '../modules/mongo'
import conf from '../modules/config'
import axios from 'axios'
import { log } from '../modules/common'

export default class Pair {
  constructor (pair, now) {
    Object.assign(this, pair)
    this.now = now
    this.name = `${this.base}${this.quote}`
    return this
  }

  tick () {
    return axios
      .get(conf.route(`Ticker?pair=${this.altname}`))
      .then(this.update.bind(this))
  }

  update (response) {
    log('saving '+ this.altname)
    let data = Object.assign({
      pair: this.altname,
      time: this.now
    }, response.data.result[this.name])
    mongo.save(data)
  }
}
