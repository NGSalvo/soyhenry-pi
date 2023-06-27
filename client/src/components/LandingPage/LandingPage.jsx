import style from './LandingPage.module.css';

import { Link } from "react-router-dom";

import dogImage from '@assets/images/charlesdeluvio-Mv9hjnEUHR4-unsplash.png';

// TODO: Lo del mensaje en la landing page

export const LandingPage = () => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        <h1>Welcome Dog Lovers!</h1>
        <Link to={`/home`}>
          <button className={style.btn}>🐶 Enter! 🐶</button>
        </Link>
      </div>
      <div className={style["image-width"]}>
        <img src={dogImage} alt="pug with scarf"/>
      </div>
    </div>
  )
}