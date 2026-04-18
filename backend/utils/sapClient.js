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

/**
 * Sends a SOAP request to SAP
 * @param {string} endpoint - The specific SOAP endpoint (if appending to baseURL) or full URL if needed
 * @param {string} soapXml - The compiled SOAP XML payload
 * @returns {Promise<string>} - The raw XML response
 */
const sendSoapRequest = async (endpoint, soapXml) => {
  try {
    // Generate the SOAMANAGER explicit route mapping for SCS services
    // Map function name (e.g., ZFM_LOGIN_DS) to service endpoint (e.g., zsd_login_ds)
    let servicePath = endpoint.toLowerCase();
    if (servicePath.startsWith('zfm_')) {
      servicePath = servicePath.replace('zfm_', 'zsd_');
    }
    const overrideEndpoint = `${servicePath}?sap-client=100`;
    console.log(`[SAP Client] Calling Endpoint: ${process.env.SAP_SOAP_BASE_URL}${overrideEndpoint}`);

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
