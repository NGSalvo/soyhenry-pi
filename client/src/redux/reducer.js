import { INIT_DOGS, FILTER, ORDER, SEARCH_BY_NAME_DOGS, CLEAR, CREATE_DOG, FILTER_BY_TEMPERAMENT } from "./action-types"

const initialState = {
  myDogs: [],
  allDogs: [],
  temperamentFilter: [],
  createdAt: 'ALL'
}

let filteredDogs = []

export const reducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case INIT_DOGS:
      return {
        ...state,
        myDogs: payload,
        allDogs: payload
      }
    
    case SEARCH_BY_NAME_DOGS:
      return {
        ...state,
        myDogs: payload,
      }
    case FILTER:
      filteredDogs = []
      if (payload === 'ALL') {
        filteredDogs = state.allDogs
      }
      if (payload === 'API') {
        filteredDogs = state.allDogs.filter(dog => typeof dog.id === 'number')
      }
      if (payload === 'DB') {
        filteredDogs = state.allDogs.filter(dog => typeof dog.id === 'string')
      }

      filteredDogs = filteredDogs.filter(dog =>
        state.temperamentFilter.every(filteredTemp =>
          dog.temperament?.some(temperament => temperament.name === filteredTemp)
        )
      )

      return {
        ...state,
        myDogs: filteredDogs,
        createdAt: payload
      }

    case FILTER_BY_TEMPERAMENT:
      filteredDogs = []
      const isTemperedInFilter = state.temperamentFilter.includes(payload)
      const newTemperamentFilter = isTemperedInFilter ? state.temperamentFilter.filter(temperament => temperament !== payload) : [...state.temperamentFilter, payload]

      // This one check all the dogs that got some of the tempers, so it will be increasing when selecting more traits
      // filteredDogs = state.allDogs.filter(dog => 
      //   dog.temperament?.some(temperament => newTemperamentFilter.includes(temperament.name)))

      filteredDogs = state.allDogs.filter(dog =>
        newTemperamentFilter.every(filteredTemp =>
          dog.temperament?.some(temperament => temperament.name === filteredTemp)
        )
      )

      if (state.createdAt === 'API') {
        filteredDogs = filteredDogs.filter(dog => typeof dog.id === 'number')
      }
      if (state.createdAt === 'DB') {
        filteredDogs = filteredDogs.filter(dog => typeof dog.id === 'string')
      }
      

      return {
        ...state,
        myDogs: filteredDogs,
        temperamentFilter: newTemperamentFilter
      }

    case ORDER:
      const copyOfMyDogs = [...state.myDogs]
      let orderedDogs = []
      if (payload === 'ASC') {
        orderedDogs = copyOfMyDogs.sort((a,b) => a.id - b.id)
      }
      if (payload === 'DESC') {
        orderedDogs = copyOfMyDogs.sort((a,b) => b.id - a.id)
      }
      if (payload === 'LIGHTER') {
        orderedDogs = copyOfMyDogs.sort((a,b) => a.weight.min - b.weight.min).filter(dog => dog.weight.min || dog.weight.max)
      }
      if (payload === 'HEAVIER') {
        orderedDogs = copyOfMyDogs.sort((a,b) => b.weight.max - a.weight.max).filter(dog => dog.weight.max || dog.weight.min)
        orderedDogs = orderedDogs.filter(dog => dog.weight)
      }
      if (payload === 'AZ') {
        orderedDogs = copyOfMyDogs.sort((a,b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      }
      if (payload === 'ZA') {
        orderedDogs = copyOfMyDogs.sort((a,b) => {
          if (a.name > b.name) return -1
          if (a.name < b.name) return 1
          return 0
        })
      }

      return {
        ...state,
        myDogs: orderedDogs
      }

    case CLEAR:
      return {
        ...state,
        myDogs: [...state.allDogs],
        temperamentFilter: []
      }

    case CREATE_DOG:
      const life_span = payload?.lifeSpan
      delete payload.lifeSpan
      const dog = {
        ...payload,
        life_span
      }
      return {
        ...state,
        allDogs: [...state.allDogs, dog],
        myDogs: [...state.myDogs, dog]
      }

    default:
      return {...state}
  }
}