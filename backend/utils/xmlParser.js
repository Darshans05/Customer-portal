const xml2js = require('xml2js');

const parser = new xml2js.Parser({ 
  explicitArray: false, 
  ignoreAttrs: true,
  tagNameProcessors: [xml2js.processors.stripPrefix] 
});

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
        try {
          // Robustly find Envelope and Body regardless of prefix-stripping or exact casing
          const envelope = result.Envelope || result.envelope || result['soap-env:Envelope'] || result;
          const body = envelope.Body || envelope.body || envelope;
          
          // Return the Body content. Services will drill further into specific response tags.
          resolve(body);
        } catch (e) {
          console.warn('[XML Parser] Drilling failed, returning raw result:', e.message);
          resolve(result);
        }
      }
    });
  });
};

module.exports = { parseXml };
