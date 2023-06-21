export const validate = (inputs) => {
  const errors = {}

  if (!inputs.name) {
    errors.name = 'Nombre es requerido'
  }

  if (inputs.minHeight > inputs.maxHeight && inputs.maxHeight > 0) {
    errors.minHeight = 'La altura mínima no puede ser mayor que la máxima'
    errors.maxHeight = 'La altura máxima no puede ser menos que la mínima'
  }

  if (inputs.minHeight < 0) {
    errors.minHeight = 'La altura debe ser mayor a 0'
  }

  if (inputs.maxHeight < 0) {
    errors.maxHeight = 'La altura debe ser mayor a 0'
  }

  if (!inputs.minHeight && !inputs.maxHeight) {
    errors.minHeight = 'Debe haber al menos una altura'
    errors.maxHeight = 'Debe haber al menos una altura'
  }

  if (inputs.minWeight > inputs.maxWeight && inputs.maxWeight > 0) {
    errors.minWeight = 'El peso mínima no puede ser mayor que la máxima'
    errors.maxWeight = 'El peso máxima no puede ser menos que la mínima'
  }

  if (inputs.minWeight < 0) {
    errors.minWeight = 'El peso debe ser mayor a 0'
  }

  if (inputs.maxWeight < 0) {
    errors.maxWeight = 'El peso debe ser mayor a 0'
  }

  if (!inputs.minWeight && !inputs.maxWeight) {
    errors.minWeight = 'Debe haber al menos un peso'
    errors.maxWeight = 'Debe haber al menos un peso'
  }

  if (inputs.minLifeSpan > inputs.maxLifeSpan && inputs.maxLifeSpan > 0) {
    errors.minLifeSpan = 'La esperanza de vida mínima no puede ser mayor que la máxima'
    errors.maxLifeSpan = 'La esperanza de vida máxima no puede ser menos que la mínima'
  }

  if (inputs.minLifeSpan < 0) {
    errors.minLifeSpan = 'La esperanza de vida debe ser mayor a 0'
  }

  if (inputs.maxLifeSpan < 0) {
    errors.maxLifeSpan = 'La esperanza de vida debe ser mayor a 0'
  }

  if (!inputs.minLifeSpan && !inputs.maxLifeSpan) {
    errors.minLifeSpan = 'Debe haber al menos una esperanza de vida'
    errors.maxLifeSpan = 'Debe haber al menos una esperanza de vida'
  }



  return errors
}