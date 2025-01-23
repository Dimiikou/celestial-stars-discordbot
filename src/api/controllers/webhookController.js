import {EmbedBuilder, Guild} from "discord.js";
import {getChannelById} from "../../base/helpers/helpers.js";

// TODO: Challenge Request https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#responding-to-a-challenge-request
// TODO: notification https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#processing-an-event
// TODO: revocation https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#revoking-your-subscription

export const notifyLive = (req, res) => {
    // TODO: Guild
    // const streamNotificationChannel = getChannelById(null, "1327668443037831362");
    const messageType = req.headers["twitch-eventsub-message-type"];

    if (messageType === "webhook_callback_verification") {
        processChallengeRequest(req, res);
        return;
    }

    if (messageType === "revocation") {
        processRevocationRequest(req, res);
        return;
    }

    res.status(200).send("Notification valid");
    // if (streamNotificationChannel !== streamNotificationChannel.isTextBased()) {
    //     return false;
    // }

    const { event } = req.body; // Zugriff auf das 'event' Objekt im Request Body
    const broadcasterUserName = event.broadcaster_user_name;

    console.log(`Username ${broadcasterUserName}`);
    // streamNotificationChannel.send();
};

function processChallengeRequest(req, res) {
    const { challenge } = req.body;
    res.status(200).send(challenge);
}

function processRevocationRequest(req, res) {
    const { subscription } = req.body;

    console.error(`Webhook Subscription revoked for ${subscription.transport.callback}`);
    console.error(`Grund: ${subscription.status}`);

    res.status(200).send();
}