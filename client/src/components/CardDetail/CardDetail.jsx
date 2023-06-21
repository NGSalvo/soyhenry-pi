import { Temperament } from "@components";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

   const fetchDog = async(id) => {
      try {
        const response = await fetch(`${dogURL}/${id}`)
        const dog = await response.json()
        const serializedDog = serialize(dog)
        setDog(serializedDog)
      } catch (error) {
        console.log(error)
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
         <img src={image.endsWith('webp') ? noDogImage : image} alt={name} />
         <button className={[style.close, style.btn].join(' ')}>X</button>
         <div className={style.info}>
            <h5>ID: {id}</h5>
            <h4 className={style.name}>{name}</h4>
            <h5>Altura: {height}</h5>
            <h5>Peso: {weight}</h5>
            <h5>Esperanza de vida: {lifeSpan}</h5>
            <h5>Temperamento: <Temperament temperaments={temperaments}/></h5>
         </div>
      </div>
   )
}