import style from './Home.module.css';

import { Cards, Pagination, TemperamentFilter } from "@components";
import { useDispatch } from 'react-redux';
import { filterByTemperament } from "../../redux/actions";
import { useState } from 'react';
import { clearCards, filterCards, orderCards } from "../../redux/actions";

export const Home = ({ dogs, currentPage, totalPages, getCurrentItems, navigateToPage }) => {
  const dispatch = useDispatch()
  const [isHidden, setHidden] = useState(false)
  const [resetSignal, setResetSignal] = useState(false);
  
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
    setResetSignal(true)
    navigateToPage(1)
    setTimeout(() => {
      // This is a workaround, I could refactor it as so the parent component has full control over the state of the filter 
      setResetSignal(false);
    }, 100);
  }

  return (
    <section className={style.container}>
      <div className={style['cards-controller']}>
        <button className={[style.btn, style.clear].join(' ')} onClick={handleClearAll}>Clear 🪄</button>
        <span>
          Created At: 
          <select onChange={handleFilter}>
            <option value="ALL">ALL</option>
            <option value="API">API</option>
            <option value="DB">DB</option>
          </select>    
        </span>
        <span>
          Order by:
          <select onChange={handleOrder}>
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
            <option value="HEAVIER">Heavier</option>
            <option value="LIGHTER">Lighter</option>
            <option value="AZ">A-Z</option>
            <option value="ZA">Z-A</option>
          </select>  
        </span>
        {
          isHidden ? 
          <button className={[style['btn-filter-on'], style.btn].join(' ')} onClick={handleToggleHideFilter}>Hide filters</button>
          :
          <button className={[style['btn-filter-off'], style.btn].join(' ')} onClick={handleToggleHideFilter}>Show filters</button>
        }
      </div>
      <div className={style['center-self']}>
        {
          isHidden ?
          <TemperamentFilter onTemperamentChange={handleTemperamentChange} navigateToPage={navigateToPage} resetSignal={resetSignal}></TemperamentFilter> : ''
        }
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} getCurrentItems={getCurrentItems} navigateToPage={navigateToPage} />
      <div className={style['cards-container']}>
        <Cards dogs={dogs}></Cards>
      </div>
    </section>
  )
}