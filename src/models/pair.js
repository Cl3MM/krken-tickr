import mongo from '../modules/mongo'
import conf from '../modules/config'
import axios from 'axios'
import { error, log } from '../modules/common'

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
      .catch((err) => {
        error(`an error occured while fetching ${this.altname}`)
        if (err.err) {
          error(`${err.err}: ${err.msg}`)
          if (err.errors) {
            error(err.errors)
          }
        } else {
          error(err)
        }
        return Promise.resolve(err)
      })
  }

  update (response) {
    if (!response) {
      return Promise.reject({err: 'TICK_UPDATE_ERROR', msg: 'empty response'})
    }
    if(response.status !== 200) {
      return Promise.reject({err: 'TICK_UPDATE_ERROR', msg: `status not OK: ${response.status}`})
    }
    if (!response.data) {
      return Promise.reject({err: 'TICK_UPDATE_ERROR', msg: `no data`})
    }
    if (response.data.error[0]) {
      return Promise.reject({err: 'TICK_UPDATE_ERROR', msg: `response contains errors`, errors: response.data.error})
    }
    let val = response.data.result[this.name] || response.data.result[this.altname]
    let data = Object.assign({
      pair: this.altname,
      time: this.now
    }, val)
    mongo.save(data)
    return Promise.resolve()
  }
}
