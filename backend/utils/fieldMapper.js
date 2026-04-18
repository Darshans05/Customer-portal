/**
 * Maps SAP field names to readable keys based on STRICT RULES
 * Convert SAP fields:
 * KUNNR → customerId
 * VBELN → documentNumber
 * NETWR → netValue
 * WAERK → currency
 * FKDAT → billingDate
 * MATNR → material
 * ARKTX → description
 */

const keyMappings = {
  'KUNNR': 'customerId',
  'VBELN': 'documentNumber',
  'NETWR': 'netValue',
  'WAERK': 'currency',
  'FKDAT': 'billingDate',
  'MATNR': 'material',
  'ARKTX': 'description',
  'NAME1': 'customerName',
  'ORT01': 'city',
  'PSTLZ': 'postalCode',
  'STRAS': 'street',
  'TELF1': 'phone',
  'SMTP_ADDR': 'email',
  'STATUS': 'status'
};

const mapSapKeys = (sapObj) => {
  if (!sapObj) return null;
  const newObj = {};
  for (const [key, value] of Object.entries(sapObj)) {
    const newKey = keyMappings[key] || key.toLowerCase();
    newObj[newKey] = value;
  }
  return newObj;
};

const mapSapList = (sapList) => {
  if (!sapList) return [];
  // xml2js might return single item objects instead of arrays when list has 1 item
  const list = Array.isArray(sapList) ? sapList : [sapList];
  return list.map(item => mapSapKeys(item));
};

module.exports = { mapSapKeys, mapSapList };
