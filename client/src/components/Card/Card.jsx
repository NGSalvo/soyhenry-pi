import style from './Card.module.css';
import { Link } from "react-router-dom";
import noDogImage from '../../assets/images/noDogImage.webp'

import { Temperament } from "@components";


export const Card = ({id, name, weight, temperaments, image}) => {
   return (
      <div className={style.container}>
         <img src={image.endsWith('webp') ? noDogImage : image} alt={name} />
         <div>
            <h2>{name}</h2>
            <hr />
            <h5>Weight: {weight}</h5>
            <h5>Temperament: <Temperament temperaments={temperaments}/></h5>
         </div>
         <button className={style.btn}>
            <Link to={`/detail/${id}`}>
               Go to details
            </Link>
         </button>
      </div>
   )
}
