import io from 'socket.io-client'
import pkg from '~/package'

const socket = io.connect(`ws://${pkg.backend}/`)

export default socket
