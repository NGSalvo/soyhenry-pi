const dog = require('./dog.routes')
const temperament = require('./temperament.routes')

const routes = (app) => {
  app.use('/dogs', dog)
  app.use('/temperaments', temperament)
}

module.exports = {
  routes
}