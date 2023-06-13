const { Router } = require('express');
const { getTemperaments } = require('../controllers');

const router = Router()

router.get('/', (req, res) => {
  getTemperaments(req, res)
})

module.exports = router