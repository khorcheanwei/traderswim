const puppeteer = require('puppeteer');
const axios = require('axios');
var qs = require('qs');

const node_cache = require("node-cache");
const auth_cache = new node_cache();

const { accountDBOperation } = require("../data-access/index.js");

function check_access_token_exceed_time_limit(accountUsername, authTokenTimeInSeconds) {

    const authTokenAccessTime = 1800 - 600;

    let currentTimeInSeconds = Math.floor(Date.now() / 1000);
    let authTokenTimeDifference = currentTimeInSeconds - authTokenTimeInSeconds;

    if (authTokenTimeDifference > authTokenAccessTime) {
        console.log(`Access token current time ${authTokenTimeDifference}s for account name ${accountUsername}`)
        return true
    } else {
        console.log(`Access token does not exceed time limit with time ${authTokenTimeDifference}s for account name ${accountUsername}`)
        return false;
    }
}

async function check_access_with_get_account(accountUsername, authToken) { 
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.tdameritrade.com/v1/accounts/`,
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
            }
        }
        
        const response = await axios.request(config);
        if (response.data[0]["securitiesAccount"]["accountId"] != null) {
            console.log(`Successful in check access with get accounts API for account name ${accountUsername}`)
            return true
        } else {
            console.log(`Failed in check access with get accounts API for account name ${accountUsername}`)
            return false;
        } 
    } catch (error) {
        console.log(`Failed in check access with get accounts API for account name ${accountUsername}. Error: ${error.message}`)
        return false;
    }
}

async function get_access_token_from_cache(agentID, accountUsername) {
    let auth_cache_key = agentID + "." + accountUsername + "." + "authToken";
    let auth_cache_value = auth_cache.get(auth_cache_key);

    if (auth_cache_value != undefined) {
        try {
            let authToken = auth_cache_value[0];
            return authToken
        } catch (error) {
            console.log(error.message);
            return null;
        }
    } else {
        return null
    }
}

async function get_access_token_from_refresh_token(auth_cache_key, refreshToken) {
    try {
        let data = qs.stringify({
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'access_type': '',
            'code': '',
            'client_id': 'TDATRADERX@AMER.OAUTHAP',
            'redirect_uri': ''
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.tdameritrade.com/v1/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };


        const response = await axios.request(config)

        // save authToken to cache
        let authTokenTimeInSeconds = Math.floor(Date.now() / 1000);

        let accessToken = response.data["access_token"];
        let authToken = accessToken;

        let auth_cache_value = [authToken, authTokenTimeInSeconds];
        auth_cache.set(auth_cache_key, auth_cache_value);

        return true

    } catch (error) {
        console.log(error);
        return false;
    }
}

async function get_auth_connection_time(agentID, accountUsername) {

    try {
        let auth_cache_key = agentID + "." + accountUsername + "." + "authToken";
        let auth_cache_value = auth_cache.get(auth_cache_key);

        let currentTimeInSeconds = Math.floor(Date.now() / 1000);
        

        if (auth_cache_value != undefined) {
            authTokenTimeInSeconds = auth_cache_value[1];

            let authTokenTimeDifference = currentTimeInSeconds - authTokenTimeInSeconds;
            return authTokenTimeDifference;
        } else {
            return null
        }
    } catch(error) {
        console.log(`Failed to get auth connection time for accountUsername: ${accountUsername}. Error: ${error.message}`)
        return null
    }
    
}

async function puppeteer_login_account(agentID, accountUsername, accountPassword) {
    /* Two cache key used
    - auth_cache_key {agentID}.{accountUsername}.{authToken}- Store authToken and authToken login time
    - auth_login_cache_key {agentID}.{accountUsername}.{authToken_login} - If true, now login process. If false, can start new login process 
    */

    const maxRetries = 3;
    let attempt = 1;
    let success = false;

    let refreshToken = null;
    let authToken, authTokenTimeInSeconds;

    let auth_cache_key = agentID + "." + accountUsername + "." + "authToken";
    let auth_cache_value = auth_cache.get(auth_cache_key);

    let auth_login_cache_key = agentID + "." + accountUsername + "." + "authToken_login";

    try {
        if (auth_cache.get(auth_login_cache_key) == true) {
            console.log(`Website login loading for account name ${accountUsername}`)
            return { connected: false, refreshToken: refreshToken }
        } else {
            auth_cache.set(auth_login_cache_key, true)
        }

        // get refresh token
        const queryResult = await accountDBOperation.getRefreshToken(agentID, accountUsername);
        if (queryResult["data"].length != 0) {
            refreshToken = queryResult["data"][0]["refreshToken"];
        }

        let need_login = false;
        if (auth_cache_value != undefined) {
            authToken = auth_cache_value[0];
            authTokenTimeInSeconds = auth_cache_value[1];

            const check_access_account = await check_access_with_get_account(accountUsername, authToken);
            if (check_access_token_exceed_time_limit(accountUsername, authTokenTimeInSeconds) == true || check_access_account == false) {
                need_login = true;
            } else {
                auth_cache.set(auth_login_cache_key, false)
                return { connected: true, refreshToken: refreshToken }
            }
        } else {
            need_login = true;
        }

        if (need_login) {

            // post Auth API
            const get_access_token_success = await get_access_token_from_refresh_token(auth_cache_key, refreshToken);

            if (get_access_token_success) {
                auth_cache.set(auth_login_cache_key, false)
                return { connected: true, refreshToken: refreshToken }
            }

            let sessionStorageData;

            while (attempt <= maxRetries && !success) {
                const browser = await puppeteer.launch({ headless: false });
                try {
                    const page = await browser.newPage();

                    await page.setRequestInterception(true); // enable request interception

                    page.on('request', (request) => {
                        if (!['document', 'fetch', 'script'].includes(request.resourceType())) {
                            return request.abort();
                        }
                        request.continue();
                    });

                    await page.goto('https://trade.thinkorswim.com.sg/login', { timeout: 15000 });
                    await page.waitForSelector('#username0');
                    console.log('Login thinkorswim website');

                    await page.type('#username0', accountUsername);
                    await page.type('#password1', accountPassword);

                    console.log('Login thinkorswim website...........................')

                    await page.waitForSelector('[id="accept"]');
                    await page.click('[id="accept"]');

                    await page.waitForSelector('[data-testid="home-page"]', { timeout: 15000 });
                    console.log('Login successfully');

                    // Get the session storage data
                    sessionStorageData = await page.evaluate(() => {
                        const sessionStorageData = {};
                        for (let i = 0; i < sessionStorage.length; i++) {
                            const key = sessionStorage.key(i);
                            const value = sessionStorage.getItem(key);
                            sessionStorageData[key] = value;
                        }
                        return sessionStorageData;
                    });
                    success = true;
                } catch (error) {
                    console.log(`Login failed for ${accountUsername}: ${error}`);
                    attempt++;
                } finally {

                    let authTokenTimeInSeconds = Math.floor(Date.now() / 1000);

                    if (sessionStorageData != undefined) {
                        authToken = sessionStorageData["authToken"];
                        refreshToken = sessionStorageData["refreshToken"];

                        // save refreshToken to database. Failed to save refreshToken is not considered as severe for this case.
                        const queryResult = await accountDBOperation.updateRefreshToken(refreshToken, agentID, accountUsername);
                        if (queryResult.success == false) {
                            console.log(queryResult.error);
                        }

                        // save authToken to cache 
                        auth_cache_value = [authToken, authTokenTimeInSeconds]
                        auth_cache.set(auth_cache_key, auth_cache_value)
                    }

                    await browser.close();
                }
            }

        }

        auth_cache.set(auth_login_cache_key, false)

        if (authToken != undefined) {
            console.log(authToken)
            console.log(`Login successfully with ${accountUsername}`)
            return { connected: true, refreshToken: refreshToken }
        } else {
            console.log(`Login failed with ${accountUsername}`)
            return { connected: false, refreshToken: refreshToken }
        }

    } catch (error) {
        auth_cache.set(auth_login_cache_key, false)
        console.log(`Error ${error} for ${accountUsername}`)
        return { connected: false, refreshToken: refreshToken }
    }
};

// get agent list
async function get_agent_list_to_cache() {
    try {
        let agent_list_cache_key = "agent_list";
        let agent_list_cache_value = auth_cache.get(agent_list_cache_key);

        return  agent_list_cache_value;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

async function store_agent_list_to_cache(agentID) {
    try {
        let agent_list_cache_key = "agent_list";
        let agent_list_cache_value = auth_cache.get(agent_list_cache_key);

        if (agent_list_cache_value == undefined) {
            let agent_list = []
            agent_list.push(agentID);
            auth_cache.set(agent_list_cache_key, agent_list);
        } else {
            if (agent_list_cache_value.includes(agentID) == false) {
                agent_list_cache_value.push(agentID);
            }
            auth_cache.set(agent_list_cache_key, agent_list_cache_value);
        }
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

// log out
async function delete_agent_list_from_cache(agentID) {
    try {
        let agent_list_cache_key = "agent_list";
        let agent_list_cache_value = auth_cache.get(agent_list_cache_key);

        if (agent_list_cache_value == undefined) {
            let agent_list = []
            auth_cache.set(agent_list_cache_key, agent_list);
        } else {
            let new_agent_list = []

            for (let index = 0; index < agent_list_cache_value.length; index++) {
                if (agent_list_cache_value[index] != agentID) {
                    new_agent_list.push(agentID)
                }
            }

            auth_cache.set(agent_list_cache_key, new_agent_list);
        }
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

module.exports = {
    get_auth_connection_time,
    puppeteer_login_account,
    get_access_token_from_cache,
    get_agent_list_to_cache,
    store_agent_list_to_cache,
    delete_agent_list_from_cache,
};
