import { INIT_DOGS, FILTER, ORDER, SEARCH_BY_NAME_DOGS, CLEAR } from "./action-types"

const initialState = {
  myDogs: [],
  allDogs: []
}

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
      let filteredDogs = []
      if (payload === 'ALL') {
        filteredDogs = state.allDogs
      }
      if (payload === 'API') {
        filteredDogs = state.allDogs.filter(dog => typeof dog.id === 'number')
      }
      if (payload === 'DB') {
        filteredDogs = state.allDogs.filter(dog => typeof dog.id === 'string')
      }
      return {
        ...state,
        myDogs: filteredDogs
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
        myDogs: [...state.allDogs]
      }

    default:
      return {...state}
  }
}