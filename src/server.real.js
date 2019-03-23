const { hyperlib } = require("@archipel/backend/lib/library");
// const { hyperdrive, hyperdb } = require("archipel/packages/backend/structures");
const hyperdrive = require("archipel/packages/backend/structures/hyperdrive");

// todo: move to @archipel/backend
const httpServer = require('./lib/http-server')
const DiscoverSwarmStream = require("discovery-swarm-stream/server");


const {
  makeRpcStream,
  nestStorage,
  AccessDeniedError,
  InvalidPathError
} = require("archipel/packages/common");

const raf = require("random-access-file");
const discoverySwarm = require("./lib/swarm");

const defaultConfig = {
  data: "./db"
};

module.exports = function makeServer (opts) {
  opts = Object.assign({}, defaultConfig, opts)

  // We use a file storage, and nest it below a base path.
  const storage = nestStorage(raf, opts.data);

  // Let's have a swarm proxy.
  const swarmProxy = new DiscoverSwarmStream();

  // Let's have another swarm for the backend to sync to itself.
  const swarm = discoverySwarm();

  // Let's create a server.
  const server = httpServer();

  // First websocket route: RPC
  // This exposes an endpoint for @archipel/client to connect to.
  // Arguments:
  // - a binary stream (through websocket-stream)
  // - the current request.
  server.websocket("/rpc", function(stream, req) {
    return makeRpcStream(req, {
      // We want to expose hyperlib to the world.
      // The rpc methods allow to create structures, set their sharing status,
      // get network stats.
      hyperlib: hyperlib.rpc({
        // These are the only two required params.
        storage,
        swarm,

        // The rpc backend can make use of a standard http request object.
        // It only looks at req.params.token by default (see below).
        req,

        // Hyperlib by default supports a very simple token-based
        // authentication scheme to check access to primary resources.
        // By default makeRpcStream looks for a token in req.params.token
        // Otherwise, we can supply it manually.
        // token: req.params.token,

        // We could also pass an open handler to customize how libraries
        // are opened. This does the same as above.
        async open(req, id) {
          if (!isValidPath(id)) throw new InvalidPathError();
          if (!isAuthorized("library", id, req.params.token))
            throw new AccessDeniedError();
          // The static open function manages a global cache of open libraries.
          // It throws if the library cannot be opened and returns the library
          // object otherwise.
          let library = await hyperlib.openOrGet(id, {
            storage: nestStorage(storage, id),
            swarm
          });
          req.session.hyperlib = library;
          return library;
        }
      }),

      hyperdrive: hyperdrive.rpc({
        // The rpc handlers of the structures do not use swarm and storage directly,
        // but request them from hyperlib. All instances are also tracked in a hyperlib
        // (may be in memory).
        // Thus, it needs a hyperlib instance. In the simplest case, there is just one
        // which is passed in here:

        // hyperlib: require('@archipel/backend').Hyperlib({ storage, swarm })

        // In other cases, you want to manage different hyperlibs - then use the hyperlib
        // rpc interface as specified above. The hyperlib.openLibrary() method sets
        // a session property:
        hyperlib: req => req.session.hyperlib
      }),

      // And this is also what happens by default: Structure handlers refuse to operate
      // without a library.
      hyperdb: hyperdb.rpc(),

      // And last, let's have a little fun.
      talk: async msg => {
        if (this.session.hyperlib) return "you have power or what";
        else return "smash the system comrade";
      }
    });
  });

  // Second websocket route: A discovery-swarm-stream server.
  // This allows peers to use this websocket as a proxy
  // into the discovery swarm p2p network.
  server.websocket("/swarm", function(stream, req) {
    // if (!isAuthorized('swarm', req.token)) throw new AccessDeniedError()
    return swarmProxy.handleConnection(stream);
  });

  // Serve a frontend.
  server.static("/", "./app/dist");

  // Say hi
  // Note that this is not yet specified and just a first idea.
  server.get("/.well-known/hyperstack.json", {
    name: "Arso hyperstack dev server",
    public: true,
    contact: "hi@arso.xyz"
  });

  // If in development, build our app.
  if (process.env.NODE_ENV === "development") {
    server.devTools();
  }
}



function isAuthorized(path, token) {
  return true;
}

function isValidPath(path) {
  // Let's forbid nested libraries.
  return path.match(/^[a-zA-Z0-9-]+$/);
}
