import mongojs from 'mongojs'
import conf from './config'

class Mongo {
  constructor () {
    this.db = mongojs(`${conf.db.mongo}/kraken`)
    this.ticks = this.db.collection('ticks')
    return this
  }
  save (data) {
    this.ticks.insert(data)
  }
}

export default new Mongo()
