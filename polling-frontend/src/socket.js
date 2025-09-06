// frontend/src/socket.js
import { io } from 'socket.io-client';

// Use your deployed backend URL in production
const URL = 'http://localhost:4000';
export const socket = io(URL, { autoConnect: false });