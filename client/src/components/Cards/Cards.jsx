import style from './Cards.module.css';

import { Card } from "@components";

export const Cards = ({ dogs }) => {
  function serialize({id, name, image, height, weight, life_span,temperament}) {
    const minMaxAdapter = ({min, max}) => {
      if (min && max) {
        if (min === max) return `${min}`
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
      life_span: minMaxAdapter(life_span) + ' años',
      temperament: temperamentNames
    }    
  }

  const serializedDogs = dogs.map(dog => serialize(dog))
  

  return (
    <div className={style.container}>{
      serializedDogs.map((dog) => 
        <Card
          key={dog.id}
          id={dog.id}
          name={dog.name}
          height={dog.height}
          weight={dog.weight}
          lifeSpan={dog.life_span}
          temperaments={dog.temperament}
          image={dog.image}
        />
        )
      }
    </div>
  )
}
