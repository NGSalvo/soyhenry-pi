import style from './TemperamentFilter.module.css'

export const TemperamentFilter = ({temperaments, selectedTemperaments, onTemperamentChage}) => {

  const handleClick = (temperament) => {
    let updatedSelectedTemperaments
    if (selectedTemperaments.includes(temperament)) {
      updatedSelectedTemperaments = selectedTemperaments.filter((currentTemperament) => currentTemperament !== temperament);
    } else {
      updatedSelectedTemperaments = [...selectedTemperaments, temperament];
    }

    onTemperamentChage(updatedSelectedTemperaments)
  }

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