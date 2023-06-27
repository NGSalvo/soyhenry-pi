import style from './SearchBar.module.css';

import { useState } from "react";

export const SearchBar = ({ onSearch }) => {
   const [id, setId] = useState('');

   const handleOnChange = (e) => {
      const {value} = e.target;
      setId(value);
   }

   return (
      <div className={style.container}>
         <input className={style.search} type='search' value={id} onChange={handleOnChange} placeholder='Input here...'/>
         <button className={style.btn} onClick={() => onSearch(id)}>🔎</button>
      </div>
   );
}
