const express = require("express");
const app = express();

const hydrate = require("@sustainers/event-store-aggregate-service");
const tokensFromReq = require("@sustainers/tokens-from-req");
const middleware = require("@sustainers/event-store-middleware");
const logger = require("@sustainers/logger");

middleware(app);

app.get("/", (req, res) => {
  hydrate({ params: req.query, token: tokensFromReq(req) })
    .then(aggregateRoot => res.send(aggregateRoot))
    .catch(e => res.status(e.statusCode || 500).send(e));
});

module.exports = app;
