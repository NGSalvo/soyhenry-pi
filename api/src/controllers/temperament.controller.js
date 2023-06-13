const { DOG_API_URL } = require('../utils/consts')
const { Temperament } = require('../db')

const initTemperaments = async () => {
  try {
    const dogsData = await fetch(DOG_API_URL)
    const dogs = await dogsData.json()

    const dogsTemperaments = dogs.map(dog => dog.temperament)
    const splittedTemperaments = dogsTemperaments.map(temperaments => temperaments ? temperaments.split(', ') : [])
    const temperaments = new Set(splittedTemperaments.flat())
    const recordsToInsert = Array.from(temperaments).map(temperament => ({name: temperament}))

    await Temperament.bulkCreate(recordsToInsert)

  } catch (error) {
    console.log(error.message)
  }
}

initTemperaments()

const getTemperaments = async (req, res) => {
  try {
    const temperaments = await Temperament.findAll()
    return res.status(200).send(temperaments)
  } catch(error) {
    res.status(500).send(error.message)
  }
}


module.exports = {
  getTemperaments
}