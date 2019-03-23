const { hyperlib } = require("@archipel/backend");
const {
  hypercore,
  hyperdrive,
  hyperdb
} = require("@archipel/backend/structures");
const DiscoverySwarmWeb = require("discovery-swarm-web");
const { nestStorage, makeRpcWorker } = require("@archipel/common");

const raw = require("random-access-web");
const discoverySwarm = require("./swarm");

const config = {
  gateway: "localhost:3283" // todo
};

const swarm = new DiscoverySwarmWeb({
  gateway: config.gateway,
  stream: () => hyperlib.handleConnection()
});

// We use a file storage, and nest it below a base path.
const storage = nestStorage(raw, "hyperlib");

// Set up the structure types our library should support.
hyperlib.register({ hypercore, hyperdrive, hyperdb });

// Let's have another swarm for the backend to sync to itself.
const swarm = discoverySwarm();

const worker = makeRpcWorker({
  // Passing solo: true makes this manage only one single library.
  // A call to openLibrary() is not necessary (but doesn't hurt either)
  hyperlib: hyperlib.rpc({ storage, swarm, solo: true }),
  hyperdrive: hyperdrive.rpc(),
  hyperdb: hyperdb.rpc(),
  // And last, let's have a little fun.
  talk: async msg => {
    if (this.session.hyperlib) return "you have power or what";
    else return "smash the system comrade";
  }
});

// If in development, enable logging etc.
if (process.env.NODE_ENV === "development") {
  worker.devTools();
}

// And boot it up.
worker.start();
