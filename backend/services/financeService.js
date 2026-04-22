const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapList } = require('../utils/fieldMapper');

const getInvoices = async (kunnr) => {
  const fn = 'ZFM_INVOICEDATA_DS';
  const xmlReq = buildSoapXml(fn, { USERNAME: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);

  // With stripPrefix, Drilling is straightforward
  const responseContent = jsonResponse.ZFM_INVOICEDATA_DSResponse || jsonResponse;
  const invoiceList = responseContent.ET_INVOICE;

  const items = invoiceList?.item ? invoiceList.item : (invoiceList || []);
  return mapSapList(items);
};

const getInvoicePdf = async (kunnr, vbeln) => {
  const fn = 'ZFM_INVOICEFORM_DS';
  const xmlReq = buildSoapXml(fn, {
    USERNAME: kunnr,
    IV_VEBLN: vbeln,
    IT_TAB: ''
  });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);

  const responseContent = jsonResponse.ZFM_INVOICEFORM_DSResponse || jsonResponse;
  const pdfContent = responseContent.IV_RECEIPT;

  if (pdfContent) {
    // Return buffer from Base64 string
    return Buffer.from(pdfContent, 'base64');
  }
  throw new Error('PDF Content not found in response');
};

const getPayAging = async (kunnr) => {
  const fn = 'ZFM_PAYAGING_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);

  const responseBody = jsonResponse.ZFM_PAYAGING_DSResponse || jsonResponse;
  const agingList = responseBody.AGING_LIST;

  return mapSapList(agingList?.item || agingList);
};

const getMemo = async (kunnr) => {
  const fn = 'ZFM_CDMEMO_DS';
  const xmlReq = buildSoapXml(fn, { USERNAME: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);

  const responseBody = jsonResponse.ZFM_CDMEMO_DSResponse || jsonResponse;
  const memoList = responseBody.ET_MEMO || responseBody.MEMO_LIST;

  const items = memoList?.item ? memoList.item : (memoList || []);
  return mapSapList(items);
};

module.exports = { getInvoices, getInvoicePdf, getPayAging, getMemo };
