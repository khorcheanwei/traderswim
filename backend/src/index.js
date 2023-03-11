// Dependencies

const http = require("http");

const express = require("express");

const app = express();
const redirect_uri = "";

const authenticateRoute = require("./routes/authenticate");
app.use("/authenticate", authenticateRoute);

const httpServer = http.createServer(app);
var port = process.env.PORT || 8080;
httpServer.listen(port, () => {
  console.log(`Listening at ${port}`);
});
