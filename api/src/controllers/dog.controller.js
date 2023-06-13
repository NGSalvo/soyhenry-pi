const { Dog, Height, LifeSpan, Temperament, Weight } = require('../db')
const { hasAllProperties } = require('../utils/utils')
const { DOG_API_URL } = require('../utils/consts')
const { Op } = require('sequelize')


const apiToJSON = data => {
  const newDog = {
    id: data.id,
    name: data.name,
    image: data.image?.url,
    height: parseRange(data.height.metric),
    weight: parseRange(data.weight.metric),
    life_span: parseRange(data.life_span),
    temperament: parseTemperament()
  }

  function parseRange(data) {
    const newRange = {}
    const splitted = data.split('-')
    const matchRegex = /\d+\.?\d*(?:\s-\s\d*\.?\d*)*/
    let matched = splitted.map(year => year.match(matchRegex) ? year.match(matchRegex)[0] : '' )

    if (matched.length < 2) {
      newRange.min = matched[0]
      newRange.max = matched[0]
    } else {
      newRange.min = matched[0]
      newRange.max = matched[1]
    }

    return newRange
  }

  function parseTemperament() {
    const temperaments = data.temperament?.split(', ')
    return temperaments?.map(temperament => ({ name: temperament }))
  }

  return newDog
}



const getDogs = async (req, res) => {
  try {
    const { name } = req.query

    const dogsData = !name ? await fetch(DOG_API_URL): await fetch(`${DOG_API_URL}/search?q=${name}`)

    const foundApiDogs = await dogsData.json()

    const foundDBDogs = 
    !name ? 
    await Dog.findAll({ 
      include: [ 
        {
          model: Height,
          attributes: ['min', 'max']
        },
        {
          model: Weight,
          attributes: ['min', 'max']
        },
        {
          model: Temperament,
          as: 'temperament',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          model: LifeSpan,
          attributes: ['min', 'max']
        },
      ],
      // include: { all: true },
    }) : 
    await Dog.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      },
      include: [ 
        {
          model: Height,
          attributes: ['min', 'max']
        },
        {
          model: Weight,
          attributes: ['min', 'max']
        },
        {
          model: Temperament,
          as: 'temperament',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          model: LifeSpan,
          attributes: ['min', 'max']
        },
      ]
    })

    let foundDbDogsData = foundDBDogs?.map(dog => dog.get({plain:true}))


    let adaptedDogs = foundApiDogs.map(dog => apiToJSON(dog))
    let dbAndApiDogsMerged = [...adaptedDogs, ...foundDbDogsData]
    return res.status(200).send(dbAndApiDogsMerged)

  } catch(error) {
    res.status(500).send(error.message)
  }
}

const getDog = async (req, res) => {
  try {
    const { breedId } = req.params;

    const dogsData = await fetch(DOG_API_URL)
    const foundApiDogs = await dogsData.json()
    
    const foundApidDog = foundApiDogs.filter(dog => dog.id === Number(breedId))

    if (foundApidDog.length === 1) return res.status(200).send(apiToJSON(foundApidDog[0]))

    const foundDBDogs = await Dog.findByPk(breedId, { 
      include: [ 
        {
          model: Height,
          attributes: ['min', 'max']
        },
        {
          model: Weight,
          attributes: ['min', 'max']
        },
        {
          model: Temperament,
          as: 'temperament',
          attributes: ['name'],
          through: {
            attributes: []
          }
        },
        {
          model: LifeSpan,
          attributes: ['min', 'max']
        },
      ],
      // include: { all: true },
    })

    
    if (foundDBDogs) {
      const foundDbDogsData = foundDBDogs.get({plain:true})
      
      return res.status(200).send(foundDbDogsData)
    }

    return res.status(404).send('Raza no encontrada')

  } catch(error) {
    res.status(500).send(error.message)
  }
}

const addDog = async (req, res) => {
  try {
    const requiredProperties = {
      name: true,
      height: true,
      weight: true,
      temperament: true,
      life_span: true
    }

    const dog = req.body
    const { name, height, weight, life_span: lifeSpan, temperament } = dog

    if (!hasAllProperties(dog, requiredProperties)) return res.status(401).send('Faltan campos requeridos') 

    const [ newDog ] = await Dog.findOrCreate({
      where: {
        name,
      },
      defaults: {
        height,
        weight,
        lifeSpan
      },
      include: [ Height, Weight, { model: Temperament, as: 'temperament'}, LifeSpan ],
    })

    const existingTemperaments = await Temperament.findAll({
      where: { name: temperament },
    });

    const existingTemperamentIds = existingTemperaments.map(temperament => temperament.id);
    await newDog.addTemperament(existingTemperamentIds);

    const newTemperaments = temperament.filter(name => {
      const existingTemperament = existingTemperaments.find(temperament => temperament.name === name);
      return !existingTemperament;
    });

    for (const temperamentName of newTemperaments) {
      const [temperamentInstance] = await Temperament.findOrCreate({
        where: { name: temperamentName },
      });
      await newDog.addTemperament(temperamentInstance);
    }
    
    return res.status(200).send(newDog)
  } catch(error) {
    res.status(500).send(error.message)
  }
}

const removeDog = async(req, res) => {
  try {
    const { breedId } = req.params
    
    await Dog.destroy({
      where: {
        id: breedId
      }
    })
  
    return res.sendStatus(200)
  } catch (error) {
    res.status(500).send(error.message)
  }
}


module.exports = {
  getDogs,
  getDog,
  addDog,
  removeDog
}