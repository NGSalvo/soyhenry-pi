import { useEffect, useState } from 'react';
import style from './TemperamentFilter.module.css';
import { TemperamentService } from "@services";

export const TemperamentFilter = ({ onTemperamentChange, navigateToPage, resetSignal }) => {
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
    navigateToPage && navigateToPage(1)
  }

  const fetchTemperaments = async() => {
    const allTemperaments = await TemperamentService.getTemperaments()
    setTemperaments(allTemperaments)
  }

  const resetSelectedTemperamentFilter = () => {
    setSelectedTemperaments([])
  }

  useEffect(() => {
    fetchTemperaments()

    if (resetSignal) resetSelectedTemperamentFilter()

  }, [resetSignal]);

  return (
    <div className={style.container}>
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