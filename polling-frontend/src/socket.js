// // frontend/src/socket.js
// import { io } from 'socket.io-client';

// // Use your deployed backend URL in production
// const URL = 'http://localhost:4000';
// export const socket = io(URL, { autoConnect: false });

import { io } from 'socket.io-client';

// Use deployed backend URL if available, otherwise fallback to localhost
const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export const socket = io(URL, { autoConnect: false });
