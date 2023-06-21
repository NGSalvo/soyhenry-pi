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
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          &lt;&lt;
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          &gt;&gt;
        </button>
      </div>
    </div>
  )
}