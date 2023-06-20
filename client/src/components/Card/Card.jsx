import style from './Card.module.css';
import { Link } from "react-router-dom";
import noDogImage from '../../assets/images/noDogImage.webp'

import { Temperament } from "@components";

// export const Card = ({id, name, status, species, gender, origin, image, onClose, myFavorites, addFav, removeFav}) => {
export const Card = ({id, name, weight, temperaments, image}) => {
   return (
      <div className={style.container}>
         <img src={image.endsWith('webp') ? noDogImage : image} alt={name} />
         <button className={[style.close, style.btn].join(' ')}>X</button>
         <div className={style.info}>
            <Link to={`/detail/${id}`}>
               <h4 className={style.name}>{name}</h4>
            </Link>
            <h5>Peso: {weight}</h5>
            <h5>Temperamento: <Temperament temperaments={temperaments}/></h5>
         </div>
      </div>
   )
}
