import {io } from 'socket.io-client'

export const initializeSocketConnection = () => {
    const socketUrl = import.meta.env.VITE_API_URL ||
        (typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'));

    const socket = io(socketUrl, {
        withCredentials: true
    });

    socket.on("connect", () => {
        console.log("Connected to Socket.io server");
    });

    return socket;
};