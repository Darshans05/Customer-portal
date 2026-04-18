const xml2js = require('xml2js');

const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true });

/**
 * Parses raw XML into a JSON object
 * @param {string} xmlString - Raw XML
 * @returns {Promise<object>} - Parsed JSON
 */
const parseXml = async (xmlString) => {
  return new Promise((resolve, reject) => {
    parser.parseString(xmlString, (err, result) => {
      if (err) {
        reject(new Error('Failed to parse XML'));
      } else {
        // Typically extracting body from SOAP response
        try {
          const body = result['env:Envelope']['env:Body'];
          // Find the first key inside body which is the RFC response
          const rfcResponseKey = Object.keys(body)[0]; 
          resolve(body[rfcResponseKey]);
        } catch (e) {
          // If structure is not as expected, return raw result
          resolve(result);
        }
      }
    });
  });
};

module.exports = { parseXml };
