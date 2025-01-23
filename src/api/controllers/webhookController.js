import {getChannelById} from "../../base/helpers/helpers.js";
import {isSignatureValid} from "../services/twitchService.js";
import {getClient} from "../../base/index.js";
import {initConfigs} from "../../base/helpers/configLoader.js";

export const notifyLive = (req, res) => {
    if (!isSignatureValid(req)) {
        console.error("Keine Valide Signatur")
        res.status(403).send("Signature Header not valid");
        return;
    }

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

    const client = getClient();

    const {config} = initConfigs();
    const guild = client.guilds.cache.get(config.clientId);

    const streamNotificationChannel = getChannelById(guild, "1327668443037831362");
    if (streamNotificationChannel !== streamNotificationChannel.isTextBased()) {
        return false;
    }

    const {event} = req.body;
    const broadcasterUserName = event.broadcaster_user_name;

    console.log(`Username ${broadcasterUserName}`);
    streamNotificationChannel.send("Penis");
};

function processChallengeRequest(req, res) {
    const {challenge} = req.body;
    res.status(200).send(challenge);
}

function processRevocationRequest(req, res) {
    const {subscription} = req.body;

    console.error(`Webhook Subscription revoked for ${subscription.transport.callback}`);
    console.error(`Grund: ${subscription.status}`);

    res.status(200).send();
}