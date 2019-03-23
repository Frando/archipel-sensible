import { BackendProvider, BackendSetup, ArchiveList } from '@archipel/react'
import { webworkerClient, websocketClient } from '@archipel/client'

const clients = [
  webworkerClient,
  websocketClient
]

function Page () {
  return (
    <div>
      <ArchiveList />
    </div>
  )
}

const App = withBackend(Page, { clients })

ReactDOM.render(
  <App />,
  document.getElementById('app')
)

function withBackend (Component) {
  return props => <Backend><Component {...props} /></Backend>
}

function Backend (props) {
  const { children } = props
  const [setup, setSetup] = useState(null)
  return (
    <div>
      <BackendSetup clients={clients} onSet={setSetup} maximize={!setup} />
      {setup && (
        <BackendProvider clients={clients} setup={setup}>
          {children}
        </BackendProvider>
      )}
    </div>
  )
}