import React from 'react'
import { webworkerClient, websocketClient, TimeoutError, RetriesExceededError } from '@archipel/client'
import { prom } from '@archipel/common/util'
import ClientContext from '@archipel/client/react'

const clientHandler = combineClients({
  webWorker: webworkerClient,
  websocket: websocketClient
})

let client = null
let error = null

export async function openClient (type, opts) {
  try {
    client = await clientHandler.open(type, opts)
  } catch (e) {
    error = e
    throw e
  }
}

export const ClientContext = React.createContext()

export function useClient () {
  return useContext(ClientContext)
}

export function Client (props) {
  const { type, opts, devtools, children } = props
  useEffect(() => {
    openClient(type, opts)
      .then(() => setOpen(true))
      .catch(() => setError(true))
  }, [type, opts])
  const client = getClientSync()
  return (
    <ClientContext.Provider value={client}>
      {devtools && <Devtools />}
      {children}
    </ClientContext.Provider>
  )
}

const RETRY_TIMEOUT = 1000
const MAX_RETRIES = Infinity

let client = null
let [opening, isOpen] = prom()

export async function openClient (type, opts) {
  if (client) await closeClient()

  if (opts.retries > MAX_RETRIES) throw new RetriesExceededError()
  opts.retries = opts.retries ? opts.retries + 1 : 0

  try {
    if (type === 'web-worker') {
      client = await webworkerClient(opts)
    } else if (type === 'websocket') {
      client = await websocketClient(opts)
    }
    isOpen()
  } catch (e) {
    if (e instanceof TimeoutError) {
      setTimeout(() => openClient(type, opts), RETRY_TIMEOUT)
    }
  }
}

export async function getClient () {
  if (client) return client
  await opening
  return client
}

export function getClientSync () {
  return client
}

export async function closeClient () {
  if (!client || client.closed) return
  await client.close()
  client = null
}