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

  function parseRange(data) {
    const newRange = {}
    const splitted = data.split('-')
    const matchRegex = /\d+\.?\d*(?:\s-\s\d*\.?\d*)*/
    let matched = splitted.map(range => range.match(matchRegex) ? range.match(matchRegex)[0] : "" )
    
    if (matched.length < 2) {
      newRange.min = matched[0]
      newRange.max = matched[0]
    } else {
      newRange.min = matched[0] ? matched[0] : matched[1]
      newRange.max = matched[1] ? matched[1] : matched[0]
    }

    return newRange
  }

  function parseTemperament() {
    const temperaments = data.temperament?.split(', ')
    return temperaments?.map(temperament => ({ name: temperament }))
  }

  function parseImage() {
    const imageUrl = "https://cdn2.thedogapi.com/images"
    if (!data.reference_image_id) return 'noDogImage.webp'
    // TODO: get those values programatically by filtering or something
    if ([15, 125, 212].includes(data.id)) {
      return `${imageUrl}/${data.reference_image_id}.png`
    }
    return `${imageUrl}/${data.reference_image_id}.jpg`
  }

  return newDog
}

const dbToJson = data => {
  if (data.length === 0) return []
  if (Object.keys(data).length === 0) return {}

  if (Array.isArray(data)) {
    const life_span = data[0].lifeSpan
    delete data[0].lifeSpan
    return [{
      ...data[0],
      life_span
    }]
  }
  const life_span = data.lifeSpan
  delete data.lifeSpan
  return {
    ...data,
    life_span
  }

  
}

const getAllDbToJson = data => {
  return data.map(dog => {
    const life_span = dog.lifeSpan
    delete dog.lifeSpan
    return {
      ...dog,
      life_span
    }
  })
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
    foundDbDogsData = getAllDbToJson(foundDbDogsData)

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

    const UUIDRegExp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

    if (!UUIDRegExp.test(breedId)) {
      console.log('not an UUID')
      return res.status(404).json({message: 'Breed not found'})
    }
    
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
      let foundDbDogsData = foundDBDogs.get({plain:true})
      foundDbDogsData = dbToJson(foundDbDogsData)
      
      return res.status(200).send(foundDbDogsData)
    }

    return res.status(404).json({message: 'Breed not found'})

  } catch(error) {
    res.status(500).send(error)
  }
}

const addDog = async (req, res) => {
  try {
    const requiredProperties = {
      name: true,
      height: true,
      weight: true,
      temperament: true,
      life_span: true,
      image: true
    }

    const dog = req.body
    const { name, height, weight, life_span: lifeSpan, temperament, image } = dog

    if (!hasAllProperties(dog, requiredProperties)) return res.status(401).json({message: 'Missing required fields'}) 

    const [ newDog, created ] = await Dog.findOrCreate({
      where: {
        name,
        image
      },
      defaults: {
        height,
        weight,
        lifeSpan,
      },
      include: [ Height, Weight, { model: Temperament, as: 'temperament'}, LifeSpan ],
    })

    if (!created) return res.status(409).json({ message: 'Allready exist in DB' })

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
      const [temperament] = await Temperament.findOrCreate({
        where: { name: temperamentName },
      });
      await newDog.addTemperament(temperament);
    }

    //TODO: refactor to afterCreate hook so I do not have to perform an additional query

    const dogWithTemperaments = await Dog.findByPk(newDog.id, {
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
    });
    
    return res.status(200).send(dogWithTemperaments)
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