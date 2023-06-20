import { temperamentURL, dogURL } from '../utils/const'

import { INIT_DOGS, SEARCH_BY_NAME_DOGS, FILTER, ORDER, CLEAR } from "./action-types";


export const initDogs = () => {
  return async function(dispatch) {
    try {
      const response = await fetch(dogURL)
      const data = await response.json()
  
      return dispatch({type: INIT_DOGS,
      payload: data})
    } catch (error) {
      console.log('Could not add to global state allDogs')
    }
  }
}

export const searchByName = (name) => {
  return async function(dispatch) {
    try {
      const response = await fetch(`${dogURL}/?${new URLSearchParams({
        name
      })}`)
      const data = await response.json()
      console.log(data)
      return dispatch({type: SEARCH_BY_NAME_DOGS,
      payload: data})
    } catch (error) {
      console.log('Could not search by name')
    }
  }
}

// export const removeFav = (id) => {
//   return async function(dispatch) {
//     try {
//       const { data } = await axios.delete(`${URL}/${id}`)
//       return dispatch({type: REMOVE_FAV,
//       payload: data})
//     } catch (error) {
//       console.log('Could not remove from fav')
//     }
//   }
// }

export const filterCards = (infoType) => {
  return {
    type: FILTER,
    payload: infoType
  }
}

export const orderCards = (order) => {
  return {
    type: ORDER,
    payload: order
  }
}

export const clearCards = () => {
  return {
    type: CLEAR
  }
}