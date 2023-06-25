export const validate = ({ name, minHeight, maxHeight, minWeight, maxWeight, minLifeSpan, maxLifeSpan, temperament }) => {
  const errors = {}

  if (!name) {
    errors.name = 'Nombre es requerido'
  }

  if (name.length > 100) {
    const characterCount = name.length
    errors.name = `No se puede ingresar más de 100 caracteres. Cantidad actual: ${characterCount}`
  }

  if (+minHeight > +maxHeight && maxHeight > 0) {
    errors.minHeight = 'La altura mínima no puede ser mayor que la máxima'
    errors.maxHeight = 'La altura máxima no puede ser menos que la mínima'
  }

  if (+minHeight <= 0 && !maxHeight) {
    errors.minHeight = 'La altura mínima debe ser mayor a 0'
  }

  if (+maxHeight <= 0 && !minHeight) {
    errors.maxHeight = 'La altura máxima debe ser mayor a 0'
  }

  if (!minHeight && !maxHeight) {
    errors.minHeight = 'Debe haber al menos una altura'
    errors.maxHeight = 'Debe haber al menos una altura'
  }

  if (+minWeight > +maxWeight && maxWeight > 0) {
    errors.minWeight = 'El peso mínimo no puede ser mayor que el máximo'
    errors.maxWeight = 'El peso máximo no puede ser menos que el mínimo'
  }

  if (+minWeight <= 0 && !maxWeight) {
    errors.minWeight = 'El peso mínimo debe ser mayor a 0'
  }

  if (+maxWeight <= 0 && !minWeight) {
    errors.maxWeight = 'El peso máximo debe ser mayor a 0'
  }

  if (!minWeight && !maxWeight) {
    errors.minWeight = 'Debe haber al menos un peso mínimo'
    errors.maxWeight = 'Debe haber al menos un peso máximo'
  }

  if (+minLifeSpan > +maxLifeSpan && +maxLifeSpan > 0) {
    errors.minLifeSpan = 'La esperanza de vida mínima no puede ser mayor que la máxima'
    errors.maxLifeSpan = 'La esperanza de vida máxima no puede ser menos que la mínima'
  }

  if (+minLifeSpan <= 0 && !maxLifeSpan) {
    errors.minLifeSpan = 'La esperanza de vida mínima debe ser mayor a 0'
  }

  if (+maxLifeSpan <= 0 && !minLifeSpan) {
    errors.maxLifeSpan = 'La esperanza de vida máxima debe ser mayor a 0'
  }

  if (!minLifeSpan && !maxLifeSpan) {
    errors.minLifeSpan = 'Debe haber al menos una esperanza de vida'
    errors.maxLifeSpan = 'Debe haber al menos una esperanza de vida'
  }

  if (temperament.length === 0) {
    errors.temperament = 'Debe seleccionar al menos 1 temperamento'
  }

  return errors
}