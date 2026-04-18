const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');

const login = async (username, password) => {
  try {
    const functionName = 'ZFM_LOGIN_DS';

    const xmlReq = buildSoapXml(functionName, {
      USERID: username,
      PASSWORD: password,
      IT_TAB: ''
    });

    const rawXml = await sendSoapRequest(functionName, xmlReq);
    const json = await parseXml(rawXml);

    // ✅ Extract correct response path
    const response =
      json['soap-env:Envelope']?.['soap-env:Body']?.['n0:ZFM_LOGIN_DSResponse'] ||
      json['Envelope']?.['Body']?.['ZFM_LOGIN_DSResponse'];

    if (!response) {
      throw new Error('Invalid SAP response structure');
    }

    // ✅ Extract values
    const status = response.STATUS;
    const message = response.MESSAGE;

    if (status === 'SUCCESS') {
      return {
        success: true,
        customerId: username,
        message: message || 'Login successful'
      };
    } else {
      throw new Error(message || 'Invalid credentials');
    }

  } catch (error) {
    console.error('Login Error:', error.message);
    throw error;
  }
};

module.exports = { login };