import { NavLink } from 'react-router-dom';

import { SearchBar } from "@components";

import style from "./Nav.module.css";

export const Nav = ({ onSearch }) => {
  return (
    <nav className={style.container}>
      <div>
        <NavLink to={'/home'} className={({isActive}) => isActive ? style.active: style.inactive}>
          Home 🏠
        </NavLink>
        <NavLink to={'/create'} className={({isActive}) => isActive ? style.active: style.inactive}>
          Add 🐶
        </NavLink>  
      </div>
      <SearchBar onSearch={onSearch} />
    </nav>
  )
}