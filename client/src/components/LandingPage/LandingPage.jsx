import style from './LandingPage.module.css';

import { Link } from "react-router-dom";

import dogImage from '@assets/images/stas-svechnikov-rEgveRa_5ds-unsplash.jpg';

// TODO: Lo del mensaje en la landing page

export const LandingPage = () => {
  return (
    <div className={style.container}>
      <h1>¡Bienvenidos amantes de los perros!</h1>{/* Poner este mensaje dentro de la foto y que desaaparezca cuando hover */}
      <img src={dogImage} alt="Perro tirado en el suelo"/>
      <div className={style.overlay}>
        <Link to={`/home`}>
          <button className={style['place-at']}>🐶 ¡Ver MAS! 🐶</button>
        </Link>
      </div>
    </div>
  )
}