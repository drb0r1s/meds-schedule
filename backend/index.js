const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();
const connection = require("./db/connection");

const port = 9999;

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(cors({
    origin: "http://88.200.63.148:9998",
    credentials: true
}));

app.use(express.static(path.join(__dirname, "build"))); 

app.listen(port, () => console.log(`Server is listening on http://88.200.63.148:${port}/`));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/ping", async (req, res) => {
    function checkDatabaseConnection() {
        return new Promise((resolve, reject) => {
            connection.query("SELECT 1", (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });
    }

    try {
        await checkDatabaseConnection();
        res.status(200).send("OK");
    } catch (err) {
        console.error("DB health check failed:", err.message);
        res.status(500).send("Unhealthy");
    }
});

const account = require("./routes/account.js");
app.use("/account", account);

const schedule = require("./routes/schedule.js");
app.use("/schedule", schedule);

const dose = require("./routes/dose.js");
app.use("/dose", dose);

const medication = require("./routes/medication.js");
app.use("/medication", medication);

const doseMedication = require("./routes/doseMedication.js");
app.use("/dose-medication", doseMedication);

const event = require("./routes/event.js");
app.use("/event", event);

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});