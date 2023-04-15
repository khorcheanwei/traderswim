var assert = require("assert");
require("dotenv").config({ path: "/home/mern/traderswim/backend/src/.env" });

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./../../index");
chai.use(chaiHttp);

const mongoose = require("mongoose");
MONGODB_URI =
  "mongodb+srv://khorcheanwei516:E8NJwB7AmXq74N9O@parttimedev.68nzqgq.mongodb.net/test";
mongoose.connect(MONGODB_URI);

describe("Trading Account login", () => {
  chai
    .request(server)
    .post("/trading_account/login/")
    .set(
      "Cookie",
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
    )
    .send({
      accountName: "account_1",
      accountUsername: "account_username_1",
      accountPassword: "account_password_1",
    })
    .end((err, response) => {
      assert(response.status === 200);
      assert(response.body["accountName"] === "account_1");
    });
});

describe("Trading Account database", () => {
  chai
    .request(server)
    .get("/trading_account/database/")
    .set(
      "Cookie",
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
    )
    .end((err, response) => {
      assert(response.status === 200);
      const account_database = response.body;

      for (let index = 0; index < account_database.length; index++) {
        const account = account_database[index];
        assert(account.hasOwnProperty("accountBalance"));
        assert(account["accountName"] === "account_1");
        assert(account["accountConnection"] === true);
        assert(account["accountStatus"] === true);
      }
    });
});

describe("Trading Account connection", () => {
  chai
    .request(server)
    .post("/trading_account/connection/")
    .set(
      "Cookie",
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
    )
    .send({
      accountName: "account_1",
      accountConnection: true,
    })
    .end((err, response) => {
      assert(response.status === 200);
      assert(response.body === "success");
    });
});

describe("Trading Account delete", () => {
  chai
    .request(server)
    .post("/trading_account/delete_account/")
    .set(
      "Cookie",
      "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
    )
    .send({
      accountName: "account_1",
    })
    .end((err, response) => {
      assert(response.status === 200);
      assert(response.body === "success");
    });
});
