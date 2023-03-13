const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

// setup express
const app = express();
app.use(express.json());

const redirect_uri = "";

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

// agent authentication
const agentAccountRoute = require("./routes/agentAccount");
app.use("/agent_account/", agentAccountRoute);

var port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening at ${port}`);
});

/*

// account authentication
const authenticateAccount = require("./routes/authenticateAccount");
app.use("/authenticate/account", authenticateAccount);
*/

// start http server
/*
const httpServer = http.createServer(app);
*/

/*
const bcryptSalt = bcrypt.genSaltSync(12);
const jwtSecret = "12343232324";

require("dotenv").config();

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.listen(4000, "127.0.0.1");
*/
