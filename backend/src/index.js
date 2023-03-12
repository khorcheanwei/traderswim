const express = require("express");
const http = require("http");

const app = express();
const redirect_uri = "";

// agent authentication
const authenticateAgentRoute = require("./routes/authenticate_agent");
app.use("/authenticate/agent", authenticateAgentRoute);

// account authentication
const authenticateAccount = require("./routes/authenticate_account");
//app.use("/authenticate/account", authenticateAccount);

// start http server
const httpServer = http.createServer(app);

var port = process.env.PORT || 4000;
httpServer.listen(port, () => {
  console.log(`Listening at ${port}`);
});

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
