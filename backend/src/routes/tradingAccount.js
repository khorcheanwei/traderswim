const express = require("express");

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWTSECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(12);

const tradingAccountRouter = express.Router();

const { accountDBOperation } = require("../data-access/index.js");

const {
  account_login,
  account_database,
  account_connection_status,
  account_delete,
} = require("../controllers/tradingAccountController.js");

tradingAccountRouter.post("/login", async (httpRequest, httpResponse) => {
  const result = await account_login(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await account_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.post("/connection", async (httpRequest, httpResponse) => {
  const result = await account_connection_status(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.post(
  "/delete_account",
  async (httpRequest, httpResponse) => {
    const result = await account_delete(httpRequest);

    if (result.success == true) {
      httpResponse.status(200).json(result.data);
    } else {
      httpResponse.status(400).json(result.data);
    }
  }
);

/*

  var authRequest = {
    url: "https://api.tdameritrade.com/v1/oauth2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      grant_type: "authorization_code",
      access_type: "offline",
      code: req.query.code,
      client_id: process.env.CLIENT_ID + "@AMER.OAUTHAP",
      redirect_uri: redirect_uri,
    },
  };

  // make the POST request
  request(authRequest, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var authReply = JSON.parse(body);
      res.send(authReply);
    }
  });
  */

module.exports = tradingAccountRouter;
