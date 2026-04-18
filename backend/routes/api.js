const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portalController');

// AUTH
router.post('/login', portalController.login);

// PROFILE
router.get('/profile/:kunnr', portalController.getProfile);

// DASHBOARD
router.get('/inquiry/:kunnr', portalController.getInquiries);
router.get('/salesorder/:kunnr', portalController.getSalesOrders);
router.get('/delivery/:kunnr', portalController.getDeliveries);

// FINANCE
router.get('/invoice/:kunnr', portalController.getInvoices);
router.get('/invoice/pdf/:vbeln', portalController.getInvoicePdf);
router.get('/pay-aging/:kunnr', portalController.getPayAging);
router.get('/memo/:kunnr', portalController.getMemo);

// ANALYTICS
router.get('/overall-sales/:kunnr', portalController.getOverallSales);

module.exports = router;
