const { Router } = require('express');
const { getDogs, getDog, addDog, removeDog } = require('../controllers');

const router = Router()

router.get('/', (req, res) => {
  getDogs(req, res)
})

router.get('/:breedId', (req, res) => {
  getDog(req, res)
})

router.post('/', (req, res) => {
  addDog(req, res)
})

router.delete('/:breedId', (req, res) => {
  removeDog(req, res)
})

module.exports = router