import style from './Pagination.module.css'

export const Pagination = ({ currentPage, totalPages, getCurrentItems, navigateToPage }) => {
  const handlePrevious = () => {
    navigateToPage(currentPage - 1);
  }

  const handleNext = () => {
    navigateToPage(currentPage + 1);
  }

  return (
    <div>
      <div className={style.pagination}>
        <button className={style['btn-left']} onClick={handlePrevious} disabled={currentPage === 1}>
          &lt;
        </button>
        <span className={style.text}>Page {currentPage} of {totalPages === 0 ? 1 : totalPages}</span>
        <button className={style['btn-right']} onClick={handleNext} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  )
}