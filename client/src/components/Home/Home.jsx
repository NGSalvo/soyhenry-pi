import style from './Home.module.css';

import { Cards, Pagination } from "@components";

export const Home = ({ dogs, currentPage, totalPages, getCurrentItems, navigateToPage }) => {
  return (
    <div>
      <Pagination currentPage={currentPage} totalPages={totalPages} getCurrentItems={getCurrentItems} navigateToPage={navigateToPage} />
      <Cards dogs={dogs}></Cards>
    </div>
  )
}