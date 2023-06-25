import { temperamentURL, dogURL } from '../utils/const'

import { INIT_DOGS, SEARCH_BY_NAME_DOGS, FILTER, ORDER, CLEAR, CREATE_DOG, FILTER_BY_TEMPERAMENT } from "./action-types";


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
      return dispatch({type: SEARCH_BY_NAME_DOGS,
      payload: data})
    } catch (error) {
      console.log('Could not search by name')
    }
  }
}

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

export const filterByTemperament = (temperament) => {
  return {
    type: FILTER_BY_TEMPERAMENT,
    payload: temperament
  }
}

export const createDog = (payload) => {
  const method = 'POST'
  const headers = {
    "Content-Type": 'application/json; charset=UTF-8'
  }
  const body = JSON.stringify(payload)

  return async function(dispatch) {
    try {
      const response = await fetch(`${dogURL}/`, {
        method,
        headers,
        body
      })
      const data = await response.json()

      if (!response.ok) {
        let error = {
          message: data.message,
          status: response.status
        }
        throw error
      }

      alert(`${data.name} creado con exito!`)

      return dispatch(
        {
          type: CREATE_DOG,
          payload: data
        }
      )
    } catch (error) {
      if (error.status === 409) alert(error.message)
      console.log('Could not create a dog')
    }
  }
}