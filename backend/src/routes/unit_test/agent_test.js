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

describe("Agent API unit test", () => {
  it("Agent registration", async () => {
    chai
      .request(server)
      .post("/agent_account/register/")
      .send({
        agentUsername: "agent_test",
        agentEmail: "agent_test@gmail.com",
        agentPassword: "123",
      })
      .end((err, response) => {
        assert(response.status === 200);
        assert(response.body === "This username is already registered");
      });
  });

  it("Agent login", async () => {
    chai
      .request(server)
      .post("/agent_account/login/")
      .send({
        agentUsername: "agent_test",
        agentPassword: "123",
      })
      .end((err, response) => {
        const token_text = response.header["set-cookie"][0];
        const token_regex = /token=([a-zA-Z0-9.]+)/;
        const token_match = token_text.match(token_regex);
        token = token_match[0];

        assert(response.status === 200);
        assert(response.body["agentUsername"] === "agent_test");
        assert(response.body["agentEmail"] === "agent_test@gmail.com");
        assert(
          response.body["agentPassword"] ===
            "$2a$12$pGg03fhwOpJLTDNTl/KtDOls2fr4FcpuMJItHsrrZqVPUz3x6KgLO"
        );
        assert(response.body["agentTradingSessionID"] === 0);
        assert(response.body["agentIsTradingSession"] === false);
        response.header["set-cookie"][0];
      });
  });

  it("Agent login wrong password", async () => {
    chai
      .request(server)
      .post("/agent_account/login/")
      .send({
        agentUsername: "agent_test",
        agentPassword: "wrong_person",
      })
      .end((err, response) => {
        const token_text = response.header["set-cookie"][0];
        const token_regex = /token=([a-zA-Z0-9.]+)/;
        const token_match = token_text.match(token_regex);
        token = token_match[0];

        assert(response.status === 200);
        assert(response.body === "Incorrect password");
      });
  });

  it("Agent profile", async () => {
    chai
      .request(server)
      .get("/agent_account/profile/")
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0M2E5N2FlMTU0YjdjMDE2MWE5ZmY3OCIsImlhdCI6MTY4MTU2MzI2NH0.iys83-jv3jVGDZFmY2VT5NGqgWcvcH9tFpYOHOo3NaU"
      )
      .end((err, response) => {
        assert(response.status === 200);
        assert(response.body["agentUsername"] == "agent_test");
      });
  });

  /*
  afterEach(async function () {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.remove();
    }
  });*/
});
