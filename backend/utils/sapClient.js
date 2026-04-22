const axios = require('axios');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

const sapClient = axios.create({
  baseURL: process.env.SAP_SOAP_BASE_URL,
  headers: {
    'Content-Type': 'text/xml;charset=UTF-8',
    'Accept': 'text/xml'
  },
  auth: {
    username: process.env.SAP_USERNAME,
    password: process.env.SAP_PASSWORD
  },
  // SCOPED FIX: Bypass strict SSL checking for this specific SAP connection
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Explicit mapping for function names to service endpoints
const serviceMap = {
  'ZFM_INVOICEDATA_DS': 'zsd_cust_invoice_ds',
  'ZFM_INVOICEFORM_DS': 'zsd_invoiceform_ds',
  'ZFM_CUST_DELIVERY_DS': 'zsd_cust_delivery_ds',
  'ZFM_CUS_INQUIRY_DS': 'zsd_cust_inquiry_ds',
  'ZFM_CDMEMO_DS': 'zsd_cust_cdmemo_ds'
};

/**
 * Sends a SOAP request to SAP
 * @param {string} endpoint - The function name (e.g. ZFM_LOGIN_DS)
 * @param {string} soapXml - The compiled SOAP XML payload
 * @returns {Promise<string>} - The raw XML response
 */
const sendSoapRequest = async (endpoint, soapXml) => {
  try {
    // Determine the service path from our explicit map or use generic mapping
    let servicePath = serviceMap[endpoint];

    if (!servicePath) {
      servicePath = endpoint.toLowerCase();
      if (servicePath.startsWith('zfm_')) {
        servicePath = servicePath.replace('zfm_', 'zsd_');
      }
    }

    // Defensive check to avoid duplicate sap-client or multiple '?'
    const baseUrl = process.env.SAP_SOAP_BASE_URL || '';
    const hasQuery = baseUrl.includes('?') || servicePath.includes('?');
    const hasClient = baseUrl.includes('sap-client') || servicePath.includes('sap-client');
    
    let overrideEndpoint = servicePath;
    if (!hasClient) {
      overrideEndpoint += (hasQuery ? '&' : '?') + 'sap-client=100';
    }

    console.log(`[SAP Client] Calling Endpoint: ${baseUrl}${overrideEndpoint}`);

    const response = await sapClient.post(overrideEndpoint, soapXml);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('SAP Error Response:', error.response.data);
      throw new Error(`SAP Request failed with status ${error.response.status}`);
    }
    console.error('Network Error:', error.message);
    throw new Error('Could not connect to SAP server');
  }
};

module.exports = { sapClient, sendSoapRequest };
