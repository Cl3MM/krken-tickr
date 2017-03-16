let conf = {
  endpoint: 'https://api.kraken.com/0/public/',
  db: {
    mongo: 'krken_mg'
  },
  route: (u) => `${conf.endpoint}${u}`
}


export default conf
