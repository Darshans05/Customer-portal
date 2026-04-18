/**
 * Helper to build standard SOAP envelope for SAP RFC calls
 * @param {string} functionName - SAP RFC Function Module name (e.g., ZFM_LOGIN_DS)
 * @param {object} params - Key-Value pair of fields to send in the request
 * @param {string} urn - URN namespace, usually 'urn:sap-com:document:sap:rfc:functions'
 * @returns {string} - Compiled SOAP XML string
 */
const buildSoapXml = (functionName, params = {}, urn = 'urn:sap-com:document:sap:rfc:functions') => {
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="${urn}">\n`;
  xml += `   <soapenv:Header/>\n`;
  xml += `   <soapenv:Body>\n`;
  xml += `      <urn:${functionName}>\n`;
  
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      xml += `         <${key}>${value}</${key}>\n`;
    }
  }

  xml += `      </urn:${functionName}>\n`;
  xml += `   </soapenv:Body>\n`;
  xml += `</soapenv:Envelope>`;
  
  return xml;
};

module.exports = { buildSoapXml };
