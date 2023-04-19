var assert = require("assert");
require("dotenv").config({ path: "/home/mern/traderswim/backend/src/.env" });

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./../../index");
chai.use(chaiHttp);

describe("Copy trading API unit test", () => {
  it("Copy trading place order", async () => {
    chai
      .request(server)
      .post("/copy_trading_account/place_order/")
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
      )
      .send({
        stockName: "TSLA",
        stockTradeAction: "BUY",
        stockTradeType: "LIMIT",
        stockSharesTotal: 0,
        stockEntryPrice: 0,
      })
      .end((err, response) => {
        assert(response.status === 200);
        assert(response.body === "success");
      });
  });

  it("Copy trading database", async () => {
    chai
      .request(server)
      .get("/copy_trading_account/database/")
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
      )
      .end((err, response) => {
        assert(response.status === 200);
      });
  });

  it("Copy trading trade history database", async () => {
    chai
      .request(server)
      .get("/copy_trading_account/trade_history_database/")
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
      )
      .end((err, response) => {
        assert(response.status === 200);
      });
  });
});
