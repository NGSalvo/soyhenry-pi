import { useEffect, useState } from 'react';
import style from './TemperamentFilter.module.css';
import { TemperamentService } from "@services";

export const TemperamentFilter = ({ onTemperamentChange }) => {
  const [temperaments, setTemperaments] = useState([]);
  const [selectedTemperaments, setSelectedTemperaments] = useState([]);

  const handleClick = (temperament) => {
    let updatedSelectedTemperaments
    if (selectedTemperaments.includes(temperament)) {
      updatedSelectedTemperaments = selectedTemperaments.filter((currentTemperament) => currentTemperament !== temperament);
    } else {
      updatedSelectedTemperaments = [...selectedTemperaments, temperament];
    }

    onTemperamentChange(updatedSelectedTemperaments, temperament)
    setSelectedTemperaments(updatedSelectedTemperaments)
  }

  const fetchTemperaments = async() => {
    const allTemperaments = await TemperamentService.getTemperaments()
    setTemperaments(allTemperaments)
  }

  useEffect(() => {
    fetchTemperaments()
  }, []);

  return (
    <div>
      <ul>
        {
          temperaments && temperaments.map(temperament => (
            <li key={temperament.id}
              className={selectedTemperaments.includes(temperament) ? style.selected : ''}
              onClick={() => handleClick(temperament)}>
                {temperament.name}
            </li>
          ))
        }
      </ul>
    </div>
  )

}