const { expect } = require("chai");
const { post, get } = require("@sustainers/request");
const uuid = require("@sustainers/uuid");

const aggregateUrl = "https://aggregate.event-store.core.staging.sustainers.io";
const addUrl = "https://add.event-store.core.staging.sustainers.io";

const domain = "domain";
const _service = "the-service-which-stores-this-event";
const service = "the-service-from-which-this-event-originated";
const network = "some-network";

describe("Event store", () => {
  it("should get aggregates successfully", async () => {
    const root = uuid();
    const payload1 = {
      a: 1,
      b: 1
    };
    const payload2 = {
      b: 2,
      c: 1
    };
    await post(`${addUrl}`, {
      domain,
      service: _service,
      event: {
        context: {
          service,
          network
        },
        fact: {
          root,
          topic: "did-nothing.core",
          version: 0,
          traceId: "a-trace-id",
          command: {
            id: "123",
            action: "some-action",
            domain,
            service: _service,
            issuedTimestamp: 123
          },
          createdTimestamp: 333
        },
        payload: payload1
      }
    });
    const { body: aggregate0 } = await get(`${aggregateUrl}`, {
      domain,
      service: _service,
      root
    });
    expect(aggregate0).to.deep.equal(JSON.stringify({ a: 1, b: 1 }));

    await post(`${addUrl}`, {
      domain,
      service: _service,
      event: {
        context: {
          service,
          network
        },
        fact: {
          root,
          topic: "did-nothing.core",
          version: 0,
          traceId: "a-trace-id",
          command: {
            id: "123",
            action: "some-action",
            domain,
            service: _service,
            issuedTimestamp: 123
          },
          createdTimestamp: 124
        },
        payload: payload2
      }
    });

    const { body: aggregate1 } = await get(`${aggregateUrl}`, {
      domain,
      service: _service,
      root
    });
    expect(aggregate1).to.deep.equal(JSON.stringify({ a: 1, b: 2, c: 1 }));
  });
  it("should get aggregates successfully when two events with the same timestamp are inserted", async () => {
    const root = uuid();
    const domain = "some-domani";

    const payload1 = {
      a: 1,
      b: 1
    };
    const payload2 = {
      b: 2,
      c: 1
    };
    await post(`${addUrl}`, {
      domain,
      service: _service,
      event: {
        context: {
          service,
          network
        },
        fact: {
          root,
          topic: "did-nothing.core",
          version: 0,
          traceId: "a-trace-id",
          command: {
            id: "123",
            action: "some-action",
            domain,
            service: _service,
            issuedTimestamp: 123
          },
          createdTimestamp: 123
        },
        payload: payload1
      }
    });
    const { body: aggregate0 } = await get(`${aggregateUrl}`, {
      domain,
      service: _service,
      root
    });
    expect(aggregate0).to.deep.equal(JSON.stringify({ a: 1, b: 1 }));

    await post(`${addUrl}`, {
      domain,
      service: _service,
      event: {
        context: {
          service,
          network
        },
        fact: {
          root,
          topic: "did-nothing.core",
          version: 0,
          traceId: "a-trace-id",
          command: {
            id: "123",
            action: "some-action",
            domain,
            service: _service,
            issuedTimestamp: 123
          },
          createdTimestamp: 123
        },
        payload: payload2
      }
    });

    const { body: aggregate1 } = await get(`${aggregateUrl}`, {
      domain,
      service: _service,
      root
    });
    expect(aggregate1).to.deep.equal(JSON.stringify({ b: 2, c: 1 }));
  });
  it("should return an error if aggregate has incorrect query params", async () => {
    const response = await get(`${aggregateUrl}`, {});
    expect(response.statusCode).to.be.at.least(400);
  });
});
