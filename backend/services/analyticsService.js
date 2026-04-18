const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapList } = require('../utils/fieldMapper');

const getOverallSales = async (kunnr) => {
  const fn = 'ZFM_FIN_SUMMARY_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { SUMMARY_LIST } = await parseXml(rawXml);
  return mapSapList(SUMMARY_LIST?.item);
};

module.exports = { getOverallSales };
