import axios from 'axios';
import {createHmac, timingSafeEqual} from 'crypto';
import {initConfigs} from "../../base/helpers/configLoader.js";

export const subscribeWebhooks = () => {
    const events = [
        {eventName: "stream.online", endpointPath: "notifyLive"},
        {eventName: "stream.offline", endpointPath: "notifyOffline"} // TODO
    ];

    events.forEach(event => {
        subscribeToTwitchEvent(event.eventName, event.endpointPath, 1111);
    });
};

export const getTwitchAccessToken = async () => {
    const {webhookConfig} = initConfigs();

    const url = "https://id.twitch.tv/oauth2/token";
    const params = {
        client_id: webhookConfig.clientId,
        client_secret: webhookConfig.clientSecret,
        grant_type: "client_credentials"
    };

    const response = await axios.post(url, null, {params});
    return response.data.access_token;
};

export const subscribeToTwitchEvent = async (eventType, eventPath, broadcaster) => {
    const url = "https://api.twitch.tv/helix/eventsub/subscriptions";
    const {config, webhookConfig} = initConfigs();

    const callbackUrl = `${webhookConfig.callbackUrl}/${eventPath}`;
    const secret = config.secret;

    const data = {
        type: eventType,
        version: '1',
        condition: {
            broadcaster_user_id: `${broadcaster}`
        },
        transport: {
            method: 'webhook',
            callback: `${callbackUrl}/v1/webhooks/`,
            secret: secret
        }
    };

    const headers = {
        'Authorization': `Bearer ${await getTwitchAccessToken()}`,
        'Client-Id': webhookConfig.clientId,
        'Content-Type': 'application/json'
    };

    const response = await axios.post(url, data, { headers });
    console.info(`Event subscription for ${eventType} returned ${response.status}`);
};

export function isSignatureValid(req) {
    const {config} = initConfigs();

    const secret = config.secret;
    const eventSubMessageId = req.headers["twitch-eventsub-message-id"];
    const eventSubMessageTimestamp = req.headers["twitch-eventsub-message-timestamp"];
    const eventSubMessageSignature = req.headers["twitch-eventsub-message-signature"];

    if (eventSubMessageId === undefined || eventSubMessageTimestamp === undefined || eventSubMessageSignature === undefined
        || eventSubMessageId === null || eventSubMessageTimestamp === null || eventSubMessageSignature === null) {
        return false;
    }

    const message = eventSubMessageId + eventSubMessageTimestamp + req.body;
    const hmac = `sha256=${getHmac(secret, message)}`;

    return verifyMessage(hmac, eventSubMessageSignature);
}

function getHmac(secret, message) {
    return createHmac('sha256', secret)
        .update(message)
        .digest('hex');
}

function verifyMessage(hmac, verifySignature) {
    return timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

//TODO: Secret Validation https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#verifying-the-event-message