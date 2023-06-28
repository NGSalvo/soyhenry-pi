import { Temperament } from "@components";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import noDogImage from '../../assets/images/noDogImage.webp';
import { dogURL } from "../../utils";
import style from './CardDetail.module.css';

const initialState = {
  id: '',
  name: '',
  image: '',
  height: '',
  weight: '',
  lifeSpan: '',
  temperaments: []
}


export const CardDetail = () => {
   const { id } = useParams()
   const [{ name, height, weight, lifeSpan, temperaments, image }, setDog] = useState(initialState)
   const navigate = useNavigate();

   const fetchDog = async(id) => {
      try {
        const response = await fetch(`${dogURL}/${id}`)
        const data = await response.json()

        if (!response.ok) {
          let error = {
            message: data.message,
            status: response.status
          }
          throw error
        }

        const serializedDog = serialize(data)
        setDog(serializedDog)
      } catch (error) {
        if (error.status === 404) alert(error.message)
        navigate('/not-found')
      }
   }

   function serialize({id, name, image, height, weight, life_span,temperament}) {
    const minMaxAdapter = ({min, max}) => {
      if (min && max) {
        return `${min} - ${max}`
      }
      if (min && !max) {
        return `${min}`
      }
      if (!min && max) {
        return `${max}`
      }
    }

    const temperamentNames = temperament ? temperament.map(t => t.name) : ''
     
    return {
      id,
      name,
      image,
      height: minMaxAdapter(height) + ' cms',
      weight: minMaxAdapter(weight) + ' kgs',
      lifeSpan: minMaxAdapter(life_span) + ' años',
      temperaments: temperamentNames
    }    
  }

   useEffect(() => {
      fetchDog(id)
      return setDog(initialState)
   }, [id])

   return (
     <div className={style.container}>
      <h2 className={style.title}>{name}</h2>
      <div className={style.card}>
        <img src={image.endsWith('webp') ? noDogImage : image} alt={name} />
        <div>
          <h5>ID: {id}</h5>
          <h5>Height: {height}</h5>
          <h5>Weight: {weight}</h5>
          <h5>Life span: {lifeSpan}</h5>
          <h5>Temperament: <Temperament temperaments={temperaments}/></h5>
        </div>
      </div>
    </div>
   )
}