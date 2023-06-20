const { Dog, Height, LifeSpan, Temperament, Weight } = require('../db')
const { hasAllProperties } = require('../utils/utils')
const { DOG_API_URL } = require('../utils/consts')
const { Op } = require('sequelize')


const apiToJSON = data => {
  
  const newDog = {
    id: data.id,
    name: data.name,
    image: parseImage(),
    height: parseRange(data.height.metric),
    weight: parseRange(data.weight.metric),
    life_span: parseRange(data.life_span),
    temperament: parseTemperament()
  }

  function parseRange(data2) {
    const newRange = {}
    const splitted = data2.split('-')
    const matchRegex = /\d+\.?\d*(?:\s-\s\d*\.?\d*)*/
    let matched = splitted.map(range => range.match(matchRegex) ? range.match(matchRegex)[0] : "" )
    
    newRange.min = matched[0] ? matched[0] : matched[1]
    newRange.max = matched[1] ? matched[1] : matched[0]

    return newRange
  }

  function parseTemperament() {
    const temperaments = data.temperament?.split(', ')
    return temperaments?.map(temperament => ({ name: temperament }))
  }

  function parseImage() {
    const imageUrl = "https://cdn2.thedogapi.com/images"
    if (!data.reference_image_id) return 'noDogImage.webp'
    if ([15, 125, 212].includes(data.id)) {
      return `${imageUrl}/${data.reference_image_id}.png`
    }
    return `${imageUrl}/${data.reference_image_id}.jpg`
  }

  return newDog
}



const getDogs = async (req, res) => {
  try {
    const { name } = req.query

    let dogsApiData

    if (name) {
      dogsApiData = fetch(DOG_API_URL)
      let dogsApiByName = fetch(`${DOG_API_URL}/search?q=${name}`)
      let [dogsApiResponse, dogByNameResponse] = await Promise.all([dogsApiData, dogsApiByName])
      
      dogsApiData = await dogsApiResponse.json()
      const dogsApiDataByName = dogsApiData.filter(dog => dog.name.toLowerCase().includes(name))

      dogsApiByName = await dogByNameResponse.json()

      const missingDogs = dogsApiByName.filter(dog => !dogsApiDataByName.find(d => d.id === dog.id))
      const allDogsApi = [...dogsApiDataByName, ...missingDogs]

      allDogsApi.sort((a,b) => a.id - b.id)
      
      dogsApiData = allDogsApi
    } else {
      dogsApiData = await fetch(DOG_API_URL)
      dogsApiData = await dogsApiData.json()
    }

    const foundApiDogs = dogsApiData

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

    console.log("🚀 ~ file: dog.controller.js:164 ~ getDog ~ apiToJSON(foundApidDog[0]:", apiToJSON(foundApidDog[0]))
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

    const [ newDog, created ] = await Dog.findOrCreate({
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

    if (!created) return res.status(200).send('Ya existe este registro')

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

    const foundDog = await Dog.findByPk(breedId)
    
    if (!foundDog) return res.status(404).send(`There is no dog with the id: ${breedId}`)
    
    await foundDog.destroy();
  
    return res.status(200).send(foundDog)

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