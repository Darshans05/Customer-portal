const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapList } = require('../utils/fieldMapper');

const getOverallSales = async (kunnr) => {
  const fn = 'ZFM_INVOICEDATA_DS';
  const xmlReq = buildSoapXml(fn, { USERNAME: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);
  
  const responseBody = jsonResponse.ZFM_INVOICEDATA_DSResponse || jsonResponse;
  const invoiceList = responseBody.ET_INVOICE;
  
  const items = invoiceList?.item ? invoiceList.item : (invoiceList || []);
  return mapSapList(items);
};

module.exports = { getOverallSales };
