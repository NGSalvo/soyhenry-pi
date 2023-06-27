import style from './Home.module.css';

import { Cards, Pagination, TemperamentFilter } from "@components";
import { useDispatch } from 'react-redux';
import { filterByTemperament } from "../../redux/actions";
import { useState } from 'react';
import { clearCards, filterCards, orderCards } from "../../redux/actions";

export const Home = ({ dogs, currentPage, totalPages, getCurrentItems, navigateToPage }) => {
  const dispatch = useDispatch()
  const [isHidden, setHidden] = useState(false)
  
  const handleTemperamentChange = (selectedTemperament, lastSelected) => {
    dispatch(filterByTemperament(lastSelected.name))
  }

  const handleToggleHideFilter = () => {
    isHidden ? setHidden(false) : setHidden(true)
  }

  const handleFilter = (event) => {
    dispatch(filterCards(event.target.value))
    navigateToPage(1)
  }

  const handleOrder = (event) => {
    dispatch(orderCards(event.target.value))
  }

  const handleClearAll = () => {
    dispatch(clearCards())
    navigateToPage(1)
  }

  return (
    <div className={style.container}>
    <button onClick={handleClearAll}>Clear 🪄</button>
      Created At: 
      <select onChange={handleFilter}>
        <option value="ALL">ALL</option>
        <option value="API">API</option>
        <option value="DB">DB</option>
      </select>    
      Order by:
      <select onChange={handleOrder}>
        <option value="ASC">Ascending</option>
        <option value="DESC">Descending</option>
        <option value="HEAVIER">Heavier</option>
        <option value="LIGHTER">Lighter</option>
        <option value="AZ">A-Z</option>
        <option value="ZA">Z-A</option>
      </select>  
      <button className={style['btn-filter']} onClick={handleToggleHideFilter}>
        {
          isHidden ? 'Hide filters' : 'Show filters'
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