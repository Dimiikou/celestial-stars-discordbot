import axios from 'axios';
import config from '../../base/configs/webhookConfig.json';

const getTwitchAccessToken = async () => {
  const url = "";
  const params = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "client_credentials"
  };

  const response = await axios.post(url, null, {params});
  return response.data.access_token;
};