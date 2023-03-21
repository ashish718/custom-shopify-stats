let router = require('express').Router()
let analyticController = require('../controller/analyticController')

router.get('/store/revenue', analyticController.revenue)

module.exports = router