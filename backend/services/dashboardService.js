const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapList } = require('../utils/fieldMapper');

const getInquiries = async (kunnr) => {
  const fn = 'ZFM_CUS_INQUIRY_DS';
  const xmlReq = buildSoapXml(fn, { USERID: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);
  
  // With stripPrefix, Drilling is straightforward
  const responseBody = jsonResponse.ZFM_CUS_INQUIRY_DSResponse || jsonResponse;
  const inquiryList = responseBody.ET_INQUIRY || responseBody.INQUIRY_LIST;
  
  const items = inquiryList?.item ? inquiryList.item : (inquiryList || []);
  return mapSapList(items);
};

const getSalesOrders = async (kunnr) => {
  const fn = 'ZFM_CUST_SALESORDER_DS';
  const xmlReq = buildSoapXml(fn, { USERNAME: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);

  const responseBody = jsonResponse.ZFM_CUST_SALESORDER_DSResponse || jsonResponse;
  const salesList = responseBody.ET_SALES || responseBody.SALES_ORDER_LIST;

  const items = salesList?.item ? salesList.item : (salesList || []);
  return mapSapList(items);
};

const getDeliveries = async (kunnr) => {
  const fn = 'ZFM_CUST_DELIVERY_DS';
  const xmlReq = buildSoapXml(fn, { USERNAME: kunnr });
  const rawXml = await sendSoapRequest(fn, xmlReq);
  const jsonResponse = await parseXml(rawXml);

  const responseBody = jsonResponse.ZFM_CUST_DELIVERY_DSResponse || jsonResponse;
  const deliveryList = responseBody.ET_DELIVERY || responseBody.DELIVERY_LIST;

  const items = deliveryList?.item ? deliveryList.item : (deliveryList || []);
  return mapSapList(items);
};

module.exports = { getInquiries, getSalesOrders, getDeliveries };
