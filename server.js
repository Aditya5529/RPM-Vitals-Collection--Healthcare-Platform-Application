const express = require("express");
const app = express();
app.use(express.json());

app.post("/alert", (req, res) => {
    const { vitals } = req.body;
    if (vitals.bloodPressure > 140) {
        return res.json({ alert: "High BP detected!" });
    }
    res.json({ message: "Vitals normal" });
});

app.listen(3000, () => console.log("Server running"));
