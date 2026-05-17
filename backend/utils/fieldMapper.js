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
  'AUDAT': 'billingDate',
  'ERDAT': 'date',
  'MATNR': 'material',
  'KWMENG': 'quantity',
  'VRKME': 'uom',
  'LFIMG': 'quantity',
  'ARKTX': 'description',
  'AUART': 'orderType',
  'NAME1': 'customerName',
  'NAME': 'customerName',
  'ORT01': 'city',
  'CITY': 'city',
  'PSTLZ': 'postalCode',
  'STRAS': 'street',
  'TELF1': 'phone',
  'PHONE': 'phone',
  'SMTP_ADDR': 'email',
  'EMAIL': 'email',
  'STATUS': 'status',
  'KUNRG': 'billToCustomer'
};

const mapSapKeys = (sapObj) => {
  if (!sapObj) return null;
  
  // If we accidentally got an array, take the first item
  const actualObj = Array.isArray(sapObj) ? sapObj[0] : sapObj;
  if (!actualObj) return null;

  const newObj = {};
  for (const [key, value] of Object.entries(actualObj)) {
    // xml2js with explicitArray:false might still return single-item arrays for text nodes sometimes
    const actualValue = Array.isArray(value) ? value[0] : value;
    
    const newKey = keyMappings[key] || key.toLowerCase();
    newObj[newKey] = actualValue;
    
    // Robustly map any SAP date field to common UI aliases
    if (['ERDAT', 'AUDAT', 'FKDAT'].includes(key)) {
      newObj['billingDate'] = actualValue;
      newObj['date'] = actualValue;
    }
  }
  return newObj;
};

const mapSapList = (sapList) => {
  if (!sapList) return [];
  
  // Robustly handle different list wrappers from SAP/xml2js
  let list = [];
  if (Array.isArray(sapList)) {
    list = sapList;
  } else if (sapList.item) {
    list = Array.isArray(sapList.item) ? sapList.item : [sapList.item];
  } else {
    list = [sapList];
  }
  
  return list.map(item => mapSapKeys(item)).filter(item => item !== null);
};

module.exports = { mapSapKeys, mapSapList };
