export const validate = ({ name, minHeight, maxHeight, minWeight, maxWeight, minLifeSpan, maxLifeSpan, temperament }) => {
  const errors = {}

  if (!name) {
    errors.name = 'Name is required'
  }

  if (name.length > 100) {
    const characterCount = name.length
    errors.name = `Cannot input more than 100 characters. Count: ${characterCount}`
  }

  if (!minHeight && !maxHeight) {
    errors.minHeight = 'There must be a height'
  }

  if (+minHeight <= 0 ) {
    errors.minHeight = 'The maximum height should be greater than 0'
  }

  if (+maxHeight <= 0) {
    errors.maxHeight = 'The maximum height should be greater than 0'
  }
  
  if (+minHeight > +maxHeight) {
    errors.minHeight = 'The maximum height cannot be greater than the maximum height'
    errors.maxHeight = 'The maximum height cannot be greater than the minimum height'
  }

  if (!minWeight && !maxWeight) {
    errors.minWeight = 'There must be a weight'
  }
  
  if (+minWeight <= 0) {
    errors.minWeight = 'The maximum weight should be greater than 0'
  }

  if (+maxWeight <= 0) {
    errors.maxWeight = 'The maximum weight should be greater than 0'
  }

  if (+minWeight > +maxWeight) {
    errors.minWeight = 'The maximum weight cannot be greater than the maximum weight'
    errors.maxWeight = 'The maximum weight cannot be greater than the minimum weight'
  }

  if (!minLifeSpan && !maxLifeSpan) {
    errors.minLifeSpan = 'There must be a life span'
  }

  if (+minLifeSpan <= 0) {
    errors.minLifeSpan = 'The maximum life span should be greater than 0'
  }
  
  if (+maxLifeSpan <= 0) {
    errors.maxLifeSpan = 'The maximum life span should be greater than 0'
  }
  
  if (+minLifeSpan > +maxLifeSpan) {
    errors.minLifeSpan = 'The maximum life span cannot be greater than the maximum life span'
    errors.maxLifeSpan = 'The maximum life span cannot be greater than the minimum life span'
  }

  if (temperament.length === 0) {
    errors.temperament = 'There must be at least one temperament'
  }

  return errors
}