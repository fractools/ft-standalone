import io from 'socket.io-client';
import pkg from '~/package';

const socket = io.connect(`${pkg.socketProtocol}${pkg.backend}/`, { query: { socketAuthToken: pkg.socketAuthToken }});

export default socket;
