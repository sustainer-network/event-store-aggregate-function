const hydrate = require("@sustainer-network/event-store-hydrate-service");
const tokensFromReq = require("@sustainer-network/tokens-from-req");

exports.aggregate = (req, res) => {
  hydrate({ params: req.query, token: tokensFromReq(req) })
    .then(aggregateRoot => res.send(aggregateRoot))
    .catch(e => res.status(e.statusCode || 500).send(e));
};
