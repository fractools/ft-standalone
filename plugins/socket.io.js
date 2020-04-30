import io from 'socket.io-client';
import pkg from '~/package';
import secret from '~/clientSecret';

const socket = io.connect(`${pkg.socketProtocol}${pkg.backend}/`, { query: { socketAuthToken: secret.socketAuthToken }});

export default socket;
