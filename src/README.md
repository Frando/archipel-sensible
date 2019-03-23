# Data model

- _structures_: A data structure that can be created from primary resources,
  exposes an api, and may be replicated to other peers.

  Types of structures are so far: hypercore, hyperdrive, hyperdb

- _archives_: A set of structures that are by default shared and managed
  together.

- _primary resources_: The primitives that structures need to operate.
  These are, so far, two types of primary resources: swarm, storage.

- _hyperlib_: A container that manages structures, archives, and primary
  resources.
