const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapList } = require('../utils/fieldMapper');

const getInquiries = async (kunnr) => {
  const fn = 'ZFM_CUS_INQUIRY_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { INQUIRY_LIST } = await parseXml(rawXml);
  return mapSapList(INQUIRY_LIST?.item);
};

const getSalesOrders = async (kunnr) => {
  const fn = 'ZFM_CUST_SALESORDER_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { SALES_ORDER_LIST } = await parseXml(rawXml);
  return mapSapList(SALES_ORDER_LIST?.item);
};

const getDeliveries = async (kunnr) => {
  const fn = 'ZFM_CUST_DELIVERY_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const { DELIVERY_LIST } = await parseXml(rawXml);
  return mapSapList(DELIVERY_LIST?.item);
};

module.exports = { getInquiries, getSalesOrders, getDeliveries };
