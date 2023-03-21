let router = require('express').Router()
let shopifyInstallController = require('../controller/shopifyInstallController')

router.get('/shopify', shopifyInstallController.install)
router.get('/shopify/callback', shopifyInstallController.verify)

module.exports = router