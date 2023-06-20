export const Temperament = ({ temperaments }) => {
  let index = 0;
  const assignId = () => {
    return index++
  }

  return (
    <>
      <ul>
        {
          temperaments ? temperaments.map((temperament) => 
            <li key={assignId()}>{temperament}</li>
          ) : <p>Indefinido</p>
        }
      </ul>
    </>
  )
}