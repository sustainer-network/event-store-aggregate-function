const express = require("express");
const app = express();

const hydrate = require("@sustainer-network/event-store-hydrate-service");
const tokensFromReq = require("@sustainer-network/tokens-from-req");
const middleware = require("@sustainer-network/event-store-middleware");

middleware(app);

app.get("/", (req, res) => {
  hydrate({ params: req.query, token: tokensFromReq(req) })
    .then(aggregateRoot => res.send(aggregateRoot))
    .catch(e => res.status(e.statusCode || 500).send(e));
});

module.exports = app;
