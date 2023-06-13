const hasAllProperties = (object, requiredProperties) => {
  // solo se pasan los que son requeridos, los falsos no es necesario
  // const requiredProperties = {
  //   author: true,
  //   title: true,
  //   contents: true
  // };

  for (const prop in requiredProperties) {
    if (!object.hasOwnProperty(prop) || object[prop] === null) {
      return false;
    }
  }
  return true;
}

module.exports = {
  hasAllProperties
}