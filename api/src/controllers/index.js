const { getDogs, getDog, addDog, removeDog } = require('./dog.controller')
const { getTemperaments } = require('./temperament.controller')

module.exports = {
  getDogs,
  getDog,
  addDog,
  removeDog,
  getTemperaments
}

