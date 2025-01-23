import axios from 'axios';
import config from '../../base/configs/webhookConfig.json';

export const getTwitchAccessToken = async () => {
  const url = "https://id.twitch.tv/oauth2/token";
  const params = {
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: "client_credentials"
  };

  const response = await axios.post(url, null, {params});
  return response.data.access_token;
};

//TODO: Secret Validation https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#verifying-the-event-message