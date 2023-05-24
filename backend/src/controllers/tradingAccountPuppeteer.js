const puppeteer = require('puppeteer');
const axios = require('axios');

const node_cache = require("node-cache");
const auth_cache = new node_cache();

const { accountDBOperation } = require("../data-access/index.js");

function check_access_token_exceed_time_limit(accountUsername, authTokenTimeInSeconds) {

    const authTokenAccessTime = 1800 - 60;

    let currentTimeInSeconds = Math.floor(Date.now() / 1000);
    let authTokenTimeDifference = currentTimeInSeconds - authTokenTimeInSeconds;

    if (authTokenTimeDifference > authTokenAccessTime) {
        console.log(`Access token current time ${authTokenTimeDifference}s for account name ${accountUsername}`)
        return true
    } else {
        console.log(`Access token does not exceed ${authTokenTimeDifference}s for account name ${accountUsername}`)
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

async function puppeteer_login_account(agentID, accountUsername, accountPassword) {
    /* Two cache key used
    - auth_cache_key {agentID}.{accountUsername}.{authToken}- Store authToken and authToken login time
    - auth_login_cache_key {agentID}.{accountUsername}.{authToken_login} - If true, now login process. If false, can start new login process 
    */
    try {
        const maxRetries = 3;
        let attempt = 1;
        let success = false;

        let authToken, authTokenTimeInSeconds;

        let auth_cache_key = agentID + "." + accountUsername + "." + "authToken";
        let auth_cache_value = auth_cache.get(auth_cache_key);

        let auth_login_cache_key = agentID + "." + accountUsername + "." + "authToken_login";

        if (auth_cache.get(auth_login_cache_key) == true) {
            console.log(`Website login loading for account name ${accountUsername}`)
            return false
        }

        let need_login = false;

        if (auth_cache_value != undefined) {
            authToken = auth_cache_value[0];
            authTokenTimeInSeconds = auth_cache_value[1];

            if (check_access_token_exceed_time_limit(accountUsername, authTokenTimeInSeconds)) {
                need_login = true;
            } else {
                return true;
            }
        } else {
            need_login = true;
        }

        if (need_login) {

            auth_cache.set(auth_login_cache_key, true)

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
                    console.error(`Login failed for ${accountUsername}: ${error}`);
                    attempt++;
                } finally {

                    let authTokenTimeInSeconds = Math.floor(Date.now() / 1000);

                    if (sessionStorageData != undefined) {
                        authToken = sessionStorageData["authToken"];

                        auth_cache_value = [authToken, authTokenTimeInSeconds]
                        auth_cache.set(auth_cache_key, auth_cache_value)
                    }

                    await browser.close();
                }
            }
            auth_cache.set(auth_login_cache_key, false)
        }

        if (authToken != undefined) {
            console.log(authToken)
            console.log(`Login successfully with ${accountUsername}`)
            return true;
        } else {
            console.log(`Login failed with ${accountUsername}`)
            return false;
        }

        //
        authTokenTimeInSeconds = Math.floor(Date.now() / 1000);
        authToken = "hjDb1U8vICUY+TpQSpDPqMTkdL2DAgau3iUK5yDJy43g+PRIKqsOapF73QMiAMcxyoaS2FEhH+vzgtZWZ9A6nMm5Q3Antzh0+hsL6cAfkBq/nX8dc4sA9F/r4bsSdvwq/EydIiIk7XiyflOP/GgR1Yn0gDLAZBcVrXFvveY0wj8JdEhk5q9FJ6j4PnzRfPvKZGUmO/8zoTcIWglQaQjmrMA2YcMNnZvVW8NA7F/ZmRHA+6tTm2V9tFev6cYftInretbQT5/K/wFtpNYpNWKjZBAEVVU+9lmZL5lx8chHTcdNmUQWhM/1LFJ0+UErFK75F2PmrOelMfI5eIf1V7TPfcChpwV1V7+wwpi+ELnWi7sApwa44ey3GROaDXaAhUUrgGwqZfzmZk+WZYd3Aeagb0IxBmEeIgPaZMH3jYe8sd7dK18sMUH+P15oUt7yOQTv3Al3ULXb+92m3uPpjvYnDHREzi5pw5vl5hE04fLeXEXAza+cUZ+2YSBRo2jS2aJB0s9C0DVG74vgxQzlOOJ5SrzOORs8rJL15VwGY100MQuG4LYrgoVi/JHHvlZy5l2sB/EXTwRvtWD/9MwJa+5uuVKnu7K37fab81zojaRGkTv2p4TqDYEXvk/RJrRofulq9yHS94hrwVZkI5TYS1C4NXY99NzP8aRVIzFQwlr1KmoTFkfx+Veucu8+O1oGPqfjWwHEXgeyD2QmkSPKdvDqFJdiYKuvriHcnghhEf9C1rRw5T7nbRhAcRHxjaOjUKVn1jq1FkeQFHlXbcuuFulZYXzrj5YUW+9STbdvuVp0DbIusd3v+HxN9t2KiF+v8V66jeELgzcwVcb2S7yrrPtbltkelq9j33vcedgqi6otyR8lAfe0dMsupV3K1Ewe7v/ae9sAtdfIB64vez45FSoTsx6hPIwAYKee6oMMaEEQaodSUo85UWsTJVpkc9hvt0UBL5OYnM6Zsds/VLljJ6CgmadHWBs4K52kxaLtnCmvFB36+v2fO0U4ddnI++I3H7T08HmtFjGyCRllAF3UYfA9cYtkV+eYJ4eb8ZMJAjlEZN+dB8H99vACkraCXmfF7sxOBXTHz2hmrHNPh3sAFLBexgRHmeZD1ORk212FD3x19z9sWBHDJACbC00B75E";
        auth_cache_value = [authToken, authTokenTimeInSeconds]
        auth_cache.set(auth_cache_key, auth_cache_value)
        return true
        //

    } catch (error) {
        auth_cache.set(auth_login_cache_key, false)
        console.error(`Error ${error} for ${accountUsername}`)
        return false;
    }
};

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


async function tradingAccountCronJob() {
    try {
        let agent_list_cache_key = "agent_list";
        let agent_list_cache_value = auth_cache.get(agent_list_cache_key);

        if (agent_list_cache_value != undefined) {
            for (let index = 0; index < agent_list_cache_value.length; index++) {
                let agentID = agent_list_cache_value[index];
                const result = await accountDBOperation.searchAccountByAgentID(agentID);

                if (result.success) {
                    const accountDocument = result.data;
                    Object.keys(accountDocument).forEach(async function (key, index) {

                        let accountUsername = accountDocument[index].accountUsername;
                        let accountPassword = accountDocument[index].accountPassword;

                        await puppeteer_login_account(agentID, accountUsername, accountPassword);
                    });
                } else {
                }
            }
        }
    } catch (error) {
        console.log(error.message);
        return null;
    }

}

module.exports = {
    puppeteer_login_account,
    get_access_token_from_cache,
    store_agent_list_to_cache,
    delete_agent_list_from_cache,
    tradingAccountCronJob
};
