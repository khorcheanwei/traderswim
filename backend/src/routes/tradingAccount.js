const express = require("express");

const tradingAccountRouter = express.Router();

const {
  account_login,
  fetch_trading_account_info,
  account_database,
  account_delete,
} = require("../controllers/tradingAccountController.js");

const { tradingAccountCronJob } = require("./../controllers/tradingAccountPuppeteer.js")

tradingAccountRouter.get("/trading_account", async (httpRequest, httpResponse) => {
  await tradingAccountCronJob()
})

tradingAccountRouter.post("/login", async (httpRequest, httpResponse) => {
  const result = await account_login(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.post("/account_fetch", async (httpRequest, httpResponse) => {
  // axios is asynchronous request
  await fetch_trading_account_info(httpRequest, httpResponse);
});

tradingAccountRouter.get("/database", async (httpRequest, httpResponse) => {
  const result = await account_database(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
});

tradingAccountRouter.post("/delete_account", async (httpRequest, httpResponse) => {
  const result = await account_delete(httpRequest);

  if (result.success == true) {
    httpResponse.status(200).json(result.data);
  } else {
    httpResponse.status(400).json(result.data);
  }
}
);

/*

  let authRequest = {
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
      let authReply = JSON.parse(body);
      res.send(authReply);
    }
  });
  */

module.exports = tradingAccountRouter;
