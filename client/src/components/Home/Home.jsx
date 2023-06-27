import style from './Home.module.css';

import { Cards, Pagination, TemperamentFilter } from "@components";
import { useDispatch } from 'react-redux';
import { filterByTemperament } from "../../redux/actions";
import { useState } from 'react';

export const Home = ({ dogs, currentPage, totalPages, getCurrentItems, navigateToPage }) => {
  const dispatch = useDispatch()
  const [isHidden, setHidden] = useState(false)
  
  const handleTemperamentChange = (selectedTemperament, lastSelected) => {
    dispatch(filterByTemperament(lastSelected.name))
  }

  const handleToggleHideFilter = () => {
    isHidden ? setHidden(false) : setHidden(true)
  }

  return (
    <div className={style.container}>
      <button className={style['btn-filter']} onClick={handleToggleHideFilter}>
        {
          isHidden ? 'Ocultar filtros' : 'Mostrar filtros'
        }
      </button>
      <div className={style['center-self']}>
        {
          isHidden ?
          <TemperamentFilter onTemperamentChange={handleTemperamentChange} navigateToPage={navigateToPage}></TemperamentFilter> : ''
        }
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} getCurrentItems={getCurrentItems} navigateToPage={navigateToPage} />
      <Cards dogs={dogs}></Cards>
    </div>
  )
}