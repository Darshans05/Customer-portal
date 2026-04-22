const authService = require('../services/authService');
const profileService = require('../services/profileService');
const dashboardService = require('../services/dashboardService');
const financeService = require('../services/financeService');
const analyticsService = require('../services/analyticsService');

// Wrap controller actions to handle async errors cleanly
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }
  const result = await authService.login(username, password);
  res.json({ success: true, ...result });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const result = await profileService.getProfile(req.params.kunnr);
  res.json({ success: true, data: result });
});

exports.getInquiries = asyncHandler(async (req, res) => {
  const data = await dashboardService.getInquiries(req.params.kunnr);
  res.json({ success: true, data });
});

exports.getSalesOrders = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSalesOrders(req.params.kunnr);
  res.json({ success: true, data });
});

exports.getDeliveries = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDeliveries(req.params.kunnr);
  res.json({ success: true, data });
});

exports.getInvoices = asyncHandler(async (req, res) => {
  const data = await financeService.getInvoices(req.params.kunnr);
  res.json({ success: true, data });
});

exports.getInvoicePdf = asyncHandler(async (req, res) => {
  const { kunnr, vbeln } = req.params;
  const pdfBuffer = await financeService.getInvoicePdf(kunnr, vbeln);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=Invoice_${vbeln}.pdf`);
  res.send(pdfBuffer);
});

exports.getPayAging = asyncHandler(async (req, res) => {
  const data = await financeService.getPayAging(req.params.kunnr);
  res.json({ success: true, data });
});

exports.getMemo = asyncHandler(async (req, res) => {
  const data = await financeService.getMemo(req.params.kunnr);
  res.json({ success: true, data });
});

exports.getOverallSales = asyncHandler(async (req, res) => {
  const data = await analyticsService.getOverallSales(req.params.kunnr);
  res.json({ success: true, data });
});
