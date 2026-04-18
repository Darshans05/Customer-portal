const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapList } = require('../utils/fieldMapper');

const getInvoices = async (kunnr) => {
  const fn = 'ZFM_INVOICEDATA_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { INVOICE_LIST } = await parseXml(rawXml);
  return mapSapList(INVOICE_LIST?.item);
};

const getInvoicePdf = async (vbeln) => {
  const fn = 'ZFM_INVOICEFORM_DS';
  const xmlReq = buildSoapXml(fn, { VBELN: vbeln });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const response = await parseXml(rawXml);
  
  if (response.PDF_CONTENT) {
    // Return buffer from Base64 string
    return Buffer.from(response.PDF_CONTENT, 'base64');
  }
  throw new Error('PDF Content not found in response');
};

const getPayAging = async (kunnr) => {
  const fn = 'ZFM_PAYAGING_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { AGING_LIST } = await parseXml(rawXml);
  return mapSapList(AGING_LIST?.item);
};

const getMemo = async (kunnr) => {
  const fn = 'ZFM_CDMEMO_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { MEMO_LIST } = await parseXml(rawXml);
  return mapSapList(MEMO_LIST?.item);
};

module.exports = { getInvoices, getInvoicePdf, getPayAging, getMemo };
