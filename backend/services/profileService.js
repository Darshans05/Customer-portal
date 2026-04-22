const { sendSoapRequest } = require('../utils/sapClient');
const { buildSoapXml } = require('../utils/soapBuilder');
const { parseXml } = require('../utils/xmlParser');
const { mapSapKeys } = require('../utils/fieldMapper');

const getProfile = async (kunnr) => {
  const functionName = 'ZFM_CUS_PROFILE_DS';
  const xmlReq = buildSoapXml(functionName, { USERID: kunnr });
  
  const rawXml = await sendSoapRequest(functionName, xmlReq);
  const jsonResponse = await parseXml(rawXml);
  
  const responseBody = jsonResponse.ZFM_CUS_PROFILE_DSResponse || jsonResponse;
  const profileData = responseBody.ES_PROFILE || responseBody.PROFILE_DATA || responseBody.E_PROFILE;
  
  return mapSapKeys(profileData);
};

module.exports = { getProfile };
