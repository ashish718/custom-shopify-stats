require("dotenv").config();
const crypto = require("crypto");
const cookie = require("cookie");
const nonce = require("nonce")();
const querystring = require("querystring");
const request = require("request-promise");
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const forwardingAddress = process.env.SHOPIFY_FORWARD_ADDRESS;
const path = require("path");
let { makeWebook } = require("../utils/webhook/install.js");

exports.install = async (req, res, next) => {
  try {
    scopes = [
      "read_customers",
      "read_orders",
    ];

    console.log("install route call-->");
    const shop = req.query.shop;
    if (shop) {
      const state = nonce();
      const redirectUri = forwardingAddress + "/shopify/callback";
      const installUrl =
        "https://" +
        shop +
        "/admin/oauth/authorize?client_id=" +
        apiKey +
        "&scope=" +
        scopes +
        "&state=" +
        state +
        "&redirect_uri=" +
        redirectUri;

      res.cookie("state", state, {
        secure: true,
        sameSite: "none",
      });

      res.redirect(installUrl);
    } else {
      return res
        .status(400)
        .send(
          "Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request"
        );
    }
  } catch (e) {
    next(e)
  } 
};

exports.verify = async (req, res) => {
  console.log("callback route call -->");
  let { shop, hmac, code, state } = req.query;
  Gshop = shop;
  Ghmac = hmac;
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    console.log({ state });
    console.log({ stateCookie });
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    // DONE: Validate request is from Shopify
    const map = Object.assign({}, req.query);
    delete map["signature"];
    delete map["hmac"];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto.createHmac("sha256", apiSecret).update(message).digest("hex"),
      "utf-8"
    );
    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
    }

    if (!hashEquals) {
      return res.status(400).send("HMAC validation failed");
    }

    // DONE: Exchange temporary code for a permanent access token

    res.cookie("shop", shop, {
      secure: true,
      sameSite: "none",
    });
    const accessTokenRequestUrl =
      "https://" + shop + "/admin/oauth/access_token";
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };
    request
      .post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then(async (accessTokenResponse) => {
        console.log({
          token: accessTokenResponse.access_token,
          shop,
          hmac,
          code,
          state,
        }, "install credentials is----");

        accessToken = accessTokenResponse.access_token;
        // credentials saved to db

        await makeWebook(accessToken, shop, hmac, code);
        console.log("afterv webhook process complete");
        // return res.sendFile(path.resolve("client", "build", "index.html"));
        // res.sendFile('index.html', { root: __dirname });
        return res.send("successfully instaled the app")
      })
      .catch((error) => {
        // res.sendFile("index.html");
        return res.send(error);
      });
  } else {
    return res.status(400).send("Required parameters missing");
  }
};