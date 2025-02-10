const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

exports.monitorVitals = functions.firestore
    .document("users/{userId}/vitals/{vitalId}")
    .onCreate(async (snapshot, context) => {
        const vitalData = snapshot.data();
        const userId = context.params.userId;

        let alerts = [];

        if (vitalData.blood_sugar > 180 || vitalData.blood_sugar < 60) {
            alerts.push("Critical Blood Sugar Level Detected!");
        }
        if (vitalData.SpO2 < 90) {
            alerts.push("Low Oxygen Level Detected!");
        }
        if (vitalData.pulse_rate > 120 || vitalData.pulse_rate < 50) {
            alerts.push("Abnormal Pulse Rate Detected!");
        }
        if (vitalData.heart_rate > 120 || vitalData.heart_rate < 50) {
            alerts.push("Abnormal Heart Rate Detected!");
        }
        if (vitalData.blood_pressure) {
            const [systolic, diastolic] = vitalData.blood_pressure.split("/").map(Number);
            if (systolic > 140 || diastolic > 90) {
                alerts.push("High Blood Pressure Detected!");
            }
        }

        if (alerts.length > 0) {
            await db.collection("users").doc(userId).collection("alerts").add({
                alerts: alerts,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Alerts generated for user ${userId}:`, alerts);
        }
    });
    import * as express from "express";

const app = express();

app.post("/send-alert", (req, res) => {
    const { vitals } = req.body;
    if (vitals.heartRate > 120) {
        return res.status(200).send({ alert: "High Heart Rate Detected!" });
    }
    return res.status(200).send({ message: "Vitals Normal" });
});

export default app;

