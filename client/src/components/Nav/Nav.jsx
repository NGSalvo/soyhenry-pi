import { useDispatch } from "react-redux";
import { NavLink } from 'react-router-dom';

import { SearchBar } from "@components";
import { clearCards, filterCards, orderCards } from "../../redux/actions";
import style from "./Nav.module.css";

export const Nav = ({ onSearch, navigateToPage }) => {
  const dispatch = useDispatch()
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
      <div>
        <NavLink to={'/home'} className={({isActive}) => isActive ? style.active: style.inactive}>
          Inicio
        </NavLink>
        <NavLink to={'/create'} className={({isActive}) => isActive ? style.active: style.inactive}>
          Agregar 🐶
        </NavLink>
        <button onClick={handleClearAll}>Limpiar todo</button>
        Fuente: 
        <select onChange={handleFilter}>
          <option value="ALL">DB y API</option>
          <option value="DB">DB</option>
          <option value="API">API</option>
        </select>    
        Ordernar por:
        <select onChange={handleOrder}>
          <option value="ASC">Ascendente</option>
          <option value="DESC">Descendente</option>
          <option value="HEAVIER">Más Pesado</option>
          <option value="LIGHTER">Más Liviano</option>
          <option value="AZ">A-Z</option>
          <option value="ZA">Z-A</option>
        </select>    
      </div>
      <SearchBar onSearch={onSearch} />
    </div>
  )
}