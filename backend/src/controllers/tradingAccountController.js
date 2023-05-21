const { accountDBOperation } = require("../data-access/index.js");
const { puppeteer_login_account, fetch_trading_account_info_api } = require("./tradingAccountPuppeteer.js")
const common = require("../common.js");

const puppeteer = require('puppeteer');
const axios = require('axios');
const jwt = require("jsonwebtoken");
const { Cluster } = require('puppeteer-cluster');
const jwtSecret = "traderswim";

// To login new account
async function account_login(httpRequest) {
  const { accountName, accountUsername, accountPassword } = httpRequest.body;

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = await jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      // search for accountName
      let result = await accountDBOperation.searchAccountName(
        agentID,
        accountName
      );
      if (result.success == true) {
        const accountNameExist = result.data;
        if (accountNameExist) {
          return { success: true, data: "Name exists" };
        }
      } else {
        return { success: false, data: result.error };
      }

      // search for accountUsername
      result = await accountDBOperation.searchAccountUsername(
        agentID,
        accountUsername
      );
      if (result.success == true) {
        const accountUsernameExist = result.data;
        if (accountUsernameExist) {
          return {
            success: true,
            data: "Account username exists.",
          };
        }
      } else {
        return {
          success: false,
          data: result.error,
        };
      }

      // login thinkorswim website
      //const connected = await puppeteer_login_account(accountUsername, accountPassword);
      const connected = true;

      if (connected) {
        result = await accountDBOperation.createAccountItem(
          agentID,
          accountName,
          accountUsername,
          accountPassword
        );

        if (result.success) {
          return {
            success: true,
            data: { accountName },
          };
        } else {
          return { success: false, data: result.error };
        }

      } else {
        return { success: true, data: "Failed to login" };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

// To fetch trading account info
async function fetch_trading_account_info(httpRequest, httpResponse) {

  const { token } = httpRequest.cookies;
  if (token) {
    try {
      const agentDocument = jwt.verify(token, jwtSecret, {});
      const agentID = agentDocument.id;

      const { accountUsername } = httpRequest.body;

      authToken = "YM6BU9HCTMF1stps5OvHZ0cUJzG3ULSLQ4GY0YVfTPzhLWQm3/CR5+r9kwW07n5rMOanyhVov+Kfo4YpF+FXYxdd6bwxgIIZ/4+guT/2Axgqa2NgqPwkbEG5uINFVk8I1Nr59VkJdjtEJko7eDBgsf73RtEnthicA4TSlQL/VHmxaJwM9bDw59oRkDQyXCSb0mTDoKinNqryJzvqP6LIJI9Mfy791rTjrj3FuCrGDaVFol4AQZU/Ztnem0UH3CR4/qWhUDBP6fXCSIs6FuGuJHvQ/Wy/yqwneSYH1x8IiHOrUcYOwDB1g8L/NLt9BvolnHiyF6PlsQ0WhoNzKAzQBXICn9FbAj/Yz5X2czuQtj4dA4Xtib/w6I5DwMdl0ETBD1NQAhhm4D2/GkW8Ylp8cxmIosmmSfYINZsy0zwNoiDlpjaJu0dUzskwQUYsK5GYuLOXi3GxYq9dgVH80uyYaovrTdPxIklaod4H3mt1vy5ADsAZfwpEgYc5UExrc7zDgthFHRA4Tjj5mFlysZWzG5elnbswxUjGisHkS100MQuG4LYrgoVi/JHHvlyZS9K8yNC1uKD5wfJgbX/8MYA+d0EsMwWy1vjAxPh1xCdVG6A1RUIHM51SAFKJvt6KDVz+zKxy6zZmrXul+/gyOVpKRyMVtwzO4NczKsJ1EqS75DwQwNRA82It6f+Hje+02v6aJexiIvv3E306bg6lQUg647Y1V6g7LBDhm9MaKLi5TAjJ6IgxlY6yirTWXgUjLzlBaq3M5Oe6vB3DTmia7FSQyhDazvi2OaXRrozQXaHjj7g8SX5TyzycmT6edFWNH3yqlPySSrkPjTXJnOc10zZ74UHD18BP8hF3OwMVx846YAFSBpBbLJZw8WXB+yopeFpQA8IazI6Q+JR053F+ot4p7gZtHWRw1kvOLzlTbY8synlMiNJCvrRz68cnHCwu7iLOdiNDuDfhhOLPx1lOmBJPO/Sao25+jyEbllwJFglVrJe7qxIcB3JFdB16ciNI12x5DnBhe30/AzLdCqB8di4e0D4BOFoWDtNb9sGgLd1noiiIwcBee6GIhu6rhCYoy8R8vGrA+nitb0u9RILjSoS+khwP41hn8jfq212FD3x19z9sWBHDJACbC00B75E";
      const config = {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
      await axios.get('https://api.tdameritrade.com/v1/accounts', config)
        .then(response => {
          httpResponse.status(200).json(response.data[0]);
        })
        .catch(error => {
          // Handle any errors
          console.log(error.message)
          httpResponse.status(400).json(error.message);
        });


    } catch (error) {
      httpResponse.status(400).json(error.message);
    }
  } else {
    httpResponse.status(200).json(null);
  }
}

// To get all accounts of particular agent
async function account_database(httpRequest) {
  const { token } = httpRequest.cookies;
  if (token) {
    const agentDocument = jwt.verify(token, jwtSecret, {});
    try {
      agentID = agentDocument.id;

      const result = await accountDBOperation.searchAccountByAgentID(agentID);


      if (result.success) {
        const accountDocument = result.data;

        let accountTableArray = [];
        Object.keys(accountDocument).forEach(async function (key, index) {
          // need to go Ameritrade website to check whether it is successful to convert to connect to website or not

          let accountConnection = await puppeteer_login_account(agentID, accountDocument[index].accountUsername, accountDocument[index].accountPassword)

          accountTableArray.push({
            accountName: accountDocument[index].accountName,
            accountUsername: accountDocument[index].accountUsername,
            accountBalance: 1000,
            accountConnection: accountConnection,
          });
        });

        return { success: true, data: accountTableArray };
      } else {
        return { success: false, data: result.error };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}


// To delete account
async function account_delete(httpRequest) {
  const { token } = httpRequest.cookies;
  const { accountName } = httpRequest.body;

  if (token) {
    try {
      const agentDocument = await jwt.verify(token, jwtSecret, {});

      const agentID = agentDocument.id;

      const result = await accountDBOperation.deleteAccount(
        agentID,
        accountName
      );

      if (result) {
        return { success: true, data: "success" };
      } else {
        return { success: false, data: result.error };
      }
    } catch (error) {
      return { success: false, data: error.message };
    }
  } else {
    return { success: true, data: null };
  }
}

module.exports = {
  account_login,
  fetch_trading_account_info,
  account_database,
  account_delete,
};
