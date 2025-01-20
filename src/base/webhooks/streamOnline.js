import express from "express";
import axios from "axios";
import crypto from "crypto";

const CLIENT_ID = "Eure_Client_ID"; // Twitch Client ID
const CLIENT_SECRET = "Euer_Client_Secret"; // Twitch Client Secret
const CALLBACK_URL = "https://eure-domain.de/webhook"; // URL des Webhooks
const STREAMER_USERNAME = "dimiikou"; // Twitch-Benutzername des Streamers
const PORT = 3000;

const app = express();
app.use(express.json());

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            "https://id.twitch.tv/oauth2/token",
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: "client_credentials",
            })
        );
        return response.data.access_token;
    } catch (error) {
        console.error("Fehler beim Abrufen des Tokens:", error.response?.data || error.message);
        throw error;
    }
};

const getStreamerId = async (username, accessToken) => {
    try {
        const response = await axios.get(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                "Client-ID": CLIENT_ID,
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.data[0]?.id;
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzer-ID:", error.response?.data || error.message);
        throw error;
    }
};

const subscribeToWebhook = async (broadcasterId, accessToken) => {
    try {
        await axios.post(
            "https://api.twitch.tv/helix/eventsub/subscriptions",
            {
                type: "stream.online",
                version: "1",
                condition: { broadcaster_user_id: broadcasterId },
                transport: {
                    method: "webhook",
                    callback: CALLBACK_URL,
                    secret: "Euer_Geheimschlüssel", // Geheimer Schlüssel für die HMAC-Prüfung
                },
            },
            {
                headers: {
                    "Client-ID": CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Webhook erfolgreich registriert.");
    } catch (error) {
        console.error("Fehler beim Registrieren des Webhooks:", error.response?.data || error.message);
    }
};

const verifyTwitchSignature = (req) => {
    const secret = "Euer_Geheimschlüssel"; // Muss mit dem Webhook-Secret übereinstimmen
    const message = `${req.headers["twitch-eventsub-message-id"]}${req.headers["twitch-eventsub-message-timestamp"]}${JSON.stringify(req.body)}`;
    const hmac = crypto.createHmac("sha256", secret).update(message).digest("hex");
    const signature = `sha256=${hmac}`;
    return signature === req.headers["twitch-eventsub-message-signature"];
};

app.post("/webhook", (req, res) => {
    if (!verifyTwitchSignature(req)) {
        console.error("Ungültige Signatur, Nachricht wird abgelehnt.");
        return res.status(403).send("Ungültige Signatur");
    }

    if (req.headers["twitch-eventsub-message-type"] === "webhook_callback_verification") {
        console.log("Verifizierung abgeschlossen.");
        return res.status(200).send(req.body.challenge);
    }

    if (req.headers["twitch-eventsub-message-type"] === "notification") {
        const event = req.body.event;
        console.log("Kanal ist jetzt live!", event);
        return res.status(200).send("OK");
    }

    res.status(400).send("Ungültige Anfrage");
});

export const startServer = async () => {
    try {
        const accessToken = await getAccessToken();
        const broadcasterId = await getStreamerId(STREAMER_USERNAME, accessToken);
        await subscribeToWebhook(broadcasterId, accessToken);

        app.listen(PORT, () => {
            console.log(`Server läuft auf Port ${PORT}`);
        });
    } catch (error) {
        console.error("Fehler beim Starten des Servers:", error.message);
    }
};